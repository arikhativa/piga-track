import "@supabase/functions-js/edge-runtime.d.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";
import { eq } from "drizzle-orm";

import {
  importBatch,
  importProfile,
  importRow,
  transaction,
} from "../../../src/db/schema.ts";

const schema = z.object({
  import_row_id: z.number().int().positive(),
  profile_id: z.uuid(),
  action: z.enum(["merge", "drop", "undo"]),
});

Deno.serve(async (req) => {
  try {
    const connectionString = Deno.env.get("DATABASE_URL")!;

    const client = postgres(connectionString, {
      prepare: false,
    });

    const db = drizzle({ client });

    const body = schema.parse(await req.json());

    const result = await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(importRow)
        .where(eq(importRow.id, body.import_row_id))
        .limit(1);

      if (!row) {
        throw new Error("Import row not found");
      }

      // MERGE
      if (body.action === "merge") {
        if (row.status !== "pending") {
          throw new Error("Import row is not pending");
        }

        const [batch] = await tx
          .select()
          .from(importBatch)
          .where(eq(importBatch.id, row.import_batch_id))
          .limit(1);

        if (!batch) {
          throw new Error("Import batch not found");
        }

        const [profile] = await tx
          .select()
          .from(importProfile)
          .where(eq(importProfile.id, batch.import_profile_id))
          .limit(1);

        if (!profile) {
          throw new Error("Import profile not found");
        }

        const [newTransaction] = await tx
          .insert(transaction)
          .values({
            profile_id: body.profile_id,
            tag_id: row.tag_id,
            project_id: row.project_id,
            category_id: row.category_id,
            currency_id: profile.currency_id,
            amount: row.amount!,
            description: row.description,
          })
          .returning();

        await tx
          .update(importRow)
          .set({
            transaction_id: newTransaction.id,
            status: "merged",
            updated_at: new Date(),
          })
          .where(eq(importRow.id, row.id));

        return newTransaction;
      }

      // DROP
      if (body.action === "drop") {
        if (row.status !== "pending") {
          throw new Error("Import row is not pending");
        }

        const [updatedRow] = await tx
          .update(importRow)
          .set({
            status: "dropped",
            updated_at: new Date(),
          })
          .where(eq(importRow.id, row.id))
          .returning();

        return updatedRow;
      }

      // UNDO
      if (body.action === "undo") {
        if (row.status === "merged") {
          if (!row.transaction_id) {
            throw new Error("Merged row has no transaction");
          }

          const transactionId = row.transaction_id;

          // Remove the FK reference first
          await tx
            .update(importRow)
            .set({
              transaction_id: null,
              status: "pending",
              updated_at: new Date(),
            })
            .where(eq(importRow.id, row.id));

          // Now delete the transaction created by the merge
          await tx
            .delete(transaction)
            .where(eq(transaction.id, transactionId));
        }

        const [updatedRow] = await tx
          .update(importRow)
          .set({
            status: "pending",
            transaction_id: null,
            updated_at: new Date(),
          })
          .where(eq(importRow.id, row.id))
          .returning();

        return updatedRow;
      }

      throw new Error("Invalid action");
    });

    return Response.json(
      { data: result },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "Invalid request",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error(error);

    return Response.json(
      {
        error: error instanceof Error
          ? error.message
          : "Failed to process import row",
      },
      { status: 500 },
    );
  }
});

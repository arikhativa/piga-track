import "@supabase/functions-js/edge-runtime.d.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";
import { eq, inArray, sql } from "drizzle-orm";

import { jsonResponse } from "../../helper.ts";
import {
  importBatch,
  importProfile,
  importRow,
  transaction,
} from "../../../src/db/schema.ts";

const schema = z.object({
  import_row_ids: z.array(z.number().int().positive()).min(1),
  profile_id: z.uuid(),
  action: z.enum(["merge", "undo"]),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse("ok");
  }

  try {
    const connectionString = Deno.env.get("SUPABASE_DB_URL")!;

    const client = postgres(connectionString, {
      prepare: false,
    });

    const db = drizzle({ client });
    const body = schema.parse(await req.json());

    const result = await db.transaction(async (tx) => {
      // --------------------------------------------------
      // Fetch all import rows in ONE query
      // --------------------------------------------------

      const rows = await tx
        .select()
        .from(importRow)
        .where(inArray(importRow.id, body.import_row_ids));

      if (rows.length !== body.import_row_ids.length) {
        throw new Error("One or more import rows were not found");
      }

      // All rows must belong to the same batch
      const batchId = rows[0].import_batch_id;

      if (rows.some((row) => row.import_batch_id !== batchId)) {
        throw new Error(
          "All import rows must belong to the same batch",
        );
      }

      // --------------------------------------------------
      // MERGE
      // --------------------------------------------------

      if (body.action === "merge") {
        for (const row of rows) {
          if (row.status !== "pending") {
            throw new Error(
              `Import row ${row.id} is not pending`,
            );
          }

          if (!row.date) {
            throw new Error(
              `Import row ${row.id} has no date`,
            );
          }

          if (!row.amount) {
            throw new Error(
              `Import row ${row.id} has no amount`,
            );
          }
        }

        // --------------------------------------------------
        // Fetch batch + profile
        // --------------------------------------------------

        const [batch] = await tx
          .select()
          .from(importBatch)
          .where(eq(importBatch.id, batchId))
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

        // --------------------------------------------------
        // Build transactions
        // --------------------------------------------------

        const transactionValues = rows.map((row) => ({
          profile_id: body.profile_id,
          tag_id: row.tag_id,
          transaction_at: new Date(
            `${row.date}T00:00:00.000Z`,
          ),
          project_id: row.project_id,
          category_id: row.category_id,
          currency_id: profile.currency_id,
          transaction_type_id: profile.transaction_type_id,
          amount: row.amount!,
          description: row.description,
        }));

        // --------------------------------------------------
        // ONE bulk transaction insert
        // --------------------------------------------------

        const newTransactions = await tx
          .insert(transaction)
          .values(transactionValues)
          .returning({
            id: transaction.id,
          });

        // --------------------------------------------------
        // ONE bulk import-row update
        // --------------------------------------------------

        const transactionCase = sql.join(
          rows.map(
            (row, index) =>
              sql`WHEN ${importRow.id} = ${row.id} THEN ${
                newTransactions[index].id
              }`,
          ),
          sql` `,
        );

        await tx
          .update(importRow)
          .set({
            transaction_id: sql`CASE ${transactionCase} ELSE NULL END::integer`,
            status: "merged",
          })
          .where(inArray(importRow.id, body.import_row_ids));

        return {
          action: "merge",
          rows: newTransactions,
        };
      }

      // --------------------------------------------------
      // UNDO
      // --------------------------------------------------

      const transactionIds = rows
        .filter(
          (row) =>
            row.status === "merged" &&
            row.transaction_id !== null,
        )
        .map((row) => row.transaction_id!);

      // Clear FK references first
      await tx
        .update(importRow)
        .set({
          status: "pending",
          transaction_id: null,
          updated_at: new Date(),
        })
        .where(inArray(importRow.id, body.import_row_ids));

      // Delete all transactions in ONE query
      if (transactionIds.length > 0) {
        await tx
          .delete(transaction)
          .where(inArray(transaction.id, transactionIds));
      }

      return {
        action: "undo",
        rows: body.import_row_ids,
      };
    });

    return jsonResponse({ data: result }, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse(
        {
          error: "Invalid request",
          issues: error.issues,
        },
        400,
      );
    }

    console.error(error);

    return jsonResponse(
      {
        error: error instanceof Error
          ? error.message
          : "Failed to process import rows",
      },
      500,
    );
  }
});

import "@supabase/functions-js/edge-runtime.d.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";

import { importBatch, importRow } from "../../../src/db/schema.ts";

const importRowSchema = z.object({
  row_number: z.number().int().positive(),
  date: z.string().nullable(),
  amount: z.string().nullable(),
  tag_value: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category_id: z.number().int().nullable().optional(),
  project_id: z.number().int().nullable().optional(),
});

const createImportBatchSchema = z.object({
  batch_name: z.string().trim().min(1),
  import_profile_id: z.number().int().positive(),
  rows: z.array(importRowSchema),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(
  body: unknown,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse("ok");
  }

  try {
    const connectionString = Deno.env.get("DATABASE_URL")!;

    const client = postgres(connectionString, { prepare: false });
    const db = drizzle({ client });

    const body = createImportBatchSchema.parse(await req.json());

    const result = await db.transaction(async (tx) => {
      const [batch] = await tx
        .insert(importBatch)
        .values({
          batch_name: body.batch_name,
          import_profile_id: body.import_profile_id,
        })
        .returning();

      const rows = body.rows.length
        ? await tx
          .insert(importRow)
          .values(
            body.rows.map((row) => ({
              ...row,
              import_batch_id: batch.id,
            })),
          )
          .returning()
        : [];

      return { batch, rows };
    });

    return jsonResponse(result, 201);
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
          : "Failed to create import batch",
      },
      500,
    );
  }
});

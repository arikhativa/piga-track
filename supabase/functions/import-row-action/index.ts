import "@supabase/functions-js/edge-runtime.d.ts";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { jsonResponse } from "../../helper.ts";
import { importRowActionSchema } from "./schema.ts";
import { getImportRows } from "./lib/get-import-rows.ts";
import { validateSameBatch } from "./lib/validate-import-rows.ts";
import { actions } from "./actions/index.ts";
import z from "zod";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse("ok");
  }

  let client;

  try {
    const connectionString = Deno.env.get("SUPABASE_DB_URL");

    if (!connectionString) {
      throw new Error("SUPABASE_DB_URL is not configured");
    }

    client = postgres(connectionString, {
      prepare: false,
    });

    const db = drizzle({ client });

    const body = importRowActionSchema.parse(await req.json());

    const result = await db.transaction(async (tx) => {
      const rows = await getImportRows(
        tx,
        body.import_row_ids,
      );

      validateSameBatch(rows);

      const action = actions[body.action];

      if (!action) {
        throw new Error(
          `Unsupported action: ${body.action}`,
        );
      }

      return action({
        db: tx,
        rows,
        profileId: body.profile_id,
        value: body.value,
      });
    });

    await client.end();

    return jsonResponse({ data: result }, 200);
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return jsonResponse(
        {
          error: "Invalid request",
          issues: error.issues,
        },
        400,
      );
    }

    return jsonResponse(
      {
        error: error instanceof Error
          ? error.message
          : "Failed to process import rows",
      },
      500,
    );
  } finally {
    await client?.end();
  }
});

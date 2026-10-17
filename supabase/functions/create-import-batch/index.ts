import "@supabase/functions-js/edge-runtime.d.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createImportBatch } from "./handlers.ts";
import { createImportBatchSchema } from "./schema.ts";
import { jsonResponse } from "../../helper.ts";
import * as schema from "../../../src/db/schema.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse("ok");
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const connectionString = Deno.env.get("SUPABASE_DB_URL");

  if (!connectionString) {
    return jsonResponse({ error: "Database configuration missing" }, 500);
  }

  const client = postgres(connectionString, { prepare: false });

  try {
    const body = createImportBatchSchema.parse(await req.json());
    const db = drizzle({ client, schema });

    const result = await createImportBatch(db, body);

    return jsonResponse(result, 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return jsonResponse(
        { error: "Invalid request", details: error.message },
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
  } finally {
    await client.end();
  }
});

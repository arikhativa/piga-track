import * as schema from "@piga/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function createDb() {
	const connectionString = Deno.env.get("SUPABASE_DB_URL");

	if (!connectionString) {
		throw new Error("SUPABASE_DB_URL is not configured");
	}

	const client = postgres(connectionString, { prepare: false });

	return drizzle({ client, schema });
}

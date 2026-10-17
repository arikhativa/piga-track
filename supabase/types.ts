import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../src/db/schema.ts";

export type DB = PostgresJsDatabase<typeof schema>;


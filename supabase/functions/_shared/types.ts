import type * as schema from "@piga/db/schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export type DB = PostgresJsDatabase<typeof schema>;

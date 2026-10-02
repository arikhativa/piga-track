import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { ImportRow } from "../../../src/db/schema.ts";

export type ImportRowActionContext = {
  db: PostgresJsDatabase;
  rows: ImportRow[];
  profileId: string;
  value?: number | string | null;
};

export type ImportRowActionResult = {
  action: string;
  rows: unknown[];
};

export type ImportRowAction = (
  context: ImportRowActionContext,
) => Promise<ImportRowActionResult>;

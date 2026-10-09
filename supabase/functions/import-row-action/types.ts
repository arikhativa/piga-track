import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { ImportRow } from "../../../src/db/schema.ts";
import { ImportRowActionInput } from "./schema.ts";

export type ImportRowActionContext =
  & Omit<
    ImportRowActionInput,
    "import_row_ids" | "action"
  >
  & {
    db: PostgresJsDatabase;
    rows: ImportRow[];
  };

export type ImportRowActionResult = {
  action: string;
  rows: unknown[];
};

export type ImportRowAction = (
  context: ImportRowActionContext,
) => Promise<ImportRowActionResult>;

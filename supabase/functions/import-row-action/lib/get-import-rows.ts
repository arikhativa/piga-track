import { inArray } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { importRow } from "../../../../src/db/schema.ts";

export async function getImportRows(
  db: PostgresJsDatabase,
  ids: number[],
) {
  const rows = await db
    .select()
    .from(importRow)
    .where(inArray(importRow.id, ids));

  if (rows.length !== ids.length) {
    throw new Error("One or more import rows were not found");
  }

  return rows;
}

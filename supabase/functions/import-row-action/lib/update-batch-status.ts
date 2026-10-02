import { eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { importBatch, importRow } from "../../../../src/db/schema.ts";

export async function updateBatchStatus(
  db: PostgresJsDatabase,
  batchId: number,
) {
  const rows = await db
    .select({
      status: importRow.status,
    })
    .from(importRow)
    .where(eq(importRow.import_batch_id, batchId));

  if (rows.length === 0 || rows.some((row) => row.status === "pending")) {
    return;
  }

  const mergedCount = rows.filter(
    (row) => row.status === "merged",
  ).length;

  const status = mergedCount > rows.length / 2 ? "approved" : "cancelled";

  await db
    .update(importBatch)
    .set({
      status,
      updated_at: new Date(),
    })
    .where(eq(importBatch.id, batchId));
}

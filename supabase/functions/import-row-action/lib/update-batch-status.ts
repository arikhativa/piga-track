import { eq } from "drizzle-orm";
import { DB } from "../../../types.ts";
import { importBatch, importRow } from "../../../../src/db/schema.ts";

export async function updateBatchStatus(
  db: DB,
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

  const status = "approved";

  await db
    .update(importBatch)
    .set({
      status,
      updated_at: new Date(),
    })
    .where(eq(importBatch.id, batchId));
}

import { eq } from "drizzle-orm";
import { DB } from "../../../types.ts";
import { importBatch, importRow } from "../../../../src/db/schema.ts";

export async function updateBatchStatus(
  db: DB,
  batchId: number,
) {
  await db
    .update(importBatch)
    .set({
      status: "approved",
      updated_at: new Date(),
    })
    .where(eq(importBatch.id, batchId));
}

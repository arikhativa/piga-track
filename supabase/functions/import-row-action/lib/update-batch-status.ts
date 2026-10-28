import { eq } from "drizzle-orm";
import { importBatch, importRow } from "../../../../src/db/schema.ts";
import type { DB } from "../../../types.ts";

export async function updateBatchStatus(db: DB, batchId: number) {
	await db
		.update(importBatch)
		.set({
			status: "approved",
			updated_at: new Date(),
		})
		.where(eq(importBatch.id, batchId));
}

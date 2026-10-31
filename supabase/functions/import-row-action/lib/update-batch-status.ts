import { importBatch } from "@piga/db/schema";
import { eq } from "drizzle-orm";
import type { DB } from "../../_shared/types.ts";

export async function updateBatchStatus(db: DB, batchId: number) {
	await db
		.update(importBatch)
		.set({
			status: "approved",
			updated_at: new Date(),
		})
		.where(eq(importBatch.id, batchId));
}

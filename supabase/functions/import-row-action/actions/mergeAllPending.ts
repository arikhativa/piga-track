import { importRow } from "@piga/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { updateBatchStatus } from "../lib/update-batch-status.ts";
import type { ImportRowAction } from "../types.ts";
import { merge } from "./merge.ts";

export const mergeAllPending: ImportRowAction = async ({
	db,
	value,
	profileId,
}) => {
	if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
		throw new Error("A valid batch ID is required");
	}

	const batchId = value;

	const pendingRows = await db
		.select()
		.from(importRow)
		.where(
			and(
				eq(importRow.import_batch_id, batchId),
				eq(importRow.status, "pending"),
				isNull(importRow.duplicate_transaction_id),
			),
		);

	if (!pendingRows.length) {
		throw new Error("No pending import rows found");
	}

	const ret = await merge({
		db,
		rows: pendingRows,
		profileId,
	});

	await updateBatchStatus(db, batchId);

	return ret;
};

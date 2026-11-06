import {
	importRow,
	maxSyncTable,
	type ImportRowInsert,
	type MaxSyncTableInsert,
} from "@piga/db/schema";
import type { createDb } from "../../../_shared/db.ts";

export interface SyncEntry {
	transaction: MaxSyncTableInsert;
	mappedImportRow: ImportRowInsert;
}

export async function sync(
	db: ReturnType<typeof createDb>,
	entries: readonly SyncEntry[],
): Promise<{ maxSyncTableId: number; importRowId: number }[]> {
	if (entries.length === 0) return [];

	return await db.transaction(async (tx) => {
		const insertedMax = await tx
			.insert(maxSyncTable)
			.values(entries.map((entry) => entry.transaction))
			.returning({ id: maxSyncTable.id, refNbr: maxSyncTable.ref_nbr });

		const maxIdsByReference = new Map(
			insertedMax.map((row) => [row.refNbr, row.id]),
    );

		const insertedImportRows = await tx
			.insert(importRow)
			.values(entries.map((entry) => ({
				...entry.mappedImportRow,
				max_sync_table_id: maxIdsByReference.get(entry.transaction.ref_nbr)!,
			})))
			.returning({
				id: importRow.id,
				maxSyncTableId: importRow.max_sync_table_id,
			});

		const importIdsByMaxId = new Map(
			insertedImportRows.map((row) => [row.maxSyncTableId, row.id]),
    );

		return entries.map((entry) => {
			const maxSyncTableId = maxIdsByReference.get(entry.transaction.ref_nbr)!;
			return {
				maxSyncTableId,
				importRowId: importIdsByMaxId.get(maxSyncTableId)!,
			};
		});
	});
}

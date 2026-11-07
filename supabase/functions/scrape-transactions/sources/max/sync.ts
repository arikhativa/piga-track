import {
	type ImportRowInsert,
	importRow,
	type MaxSyncTableInsert,
	maxSyncTable,
} from "@piga/db/schema";
import type { createDb } from "../../../_shared/db.ts";
import { loadTransactionClassifier } from "../../../_shared/transactionClassification.ts";

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
		const classify = await loadTransactionClassifier(tx);
		const insertedMax = await tx
			.insert(maxSyncTable)
			.values(entries.map((entry) => entry.transaction))
			.returning({ id: maxSyncTable.id, refNbr: maxSyncTable.ref_nbr });

		const maxIdsByReference = new Map(
			insertedMax.map((row) => [row.refNbr, row.id]),
		);

		const insertedImportRows = await tx
			.insert(importRow)
			.values(
				entries.map((entry) => ({
					...classify(entry.mappedImportRow),
					// biome-ignore lint/style/noNonNullAssertion: we added a check beforehand
					max_sync_table_id: maxIdsByReference.get(entry.transaction.ref_nbr)!,
				})),
			)
			.returning({
				id: importRow.id,
				maxSyncTableId: importRow.max_sync_table_id,
			});

		const importIdsByMaxId = new Map(
			insertedImportRows.map((row) => [row.maxSyncTableId, row.id]),
		);

		return entries.map((entry) => {
			// biome-ignore lint/style/noNonNullAssertion: we added a check beforehand
			const maxSyncTableId = maxIdsByReference.get(entry.transaction.ref_nbr)!;
			return {
				maxSyncTableId,
				// biome-ignore lint/style/noNonNullAssertion: we added a check beforehand
				importRowId: importIdsByMaxId.get(maxSyncTableId)!,
			};
		});
	});
}

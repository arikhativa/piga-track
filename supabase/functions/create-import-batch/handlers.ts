import { importBatch, importRow, transaction } from "@piga/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { loadTransactionClassifier } from "../_shared/transactionClassification.ts";
import type { DB } from "../_shared/types.ts";
import type { CreateImportBatchRequest } from "./schema.ts";

export function createImportBatch(db: DB, body: CreateImportBatchRequest) {
	return db.transaction(async (tx) => {
		const [batch] = await tx
			.insert(importBatch)
			.values({
				batch_name: body.batch_name,
				import_profile_id: body.import_profile_id,
			})
			.returning();

		const classify = await loadTransactionClassifier(tx);

		const rows = [];

		for (const row of body.rows) {
			const classifiedRow = classify(row);

			const [duplicate] = await tx
				.select({ id: transaction.id })
				.from(transaction)
				.where(
					and(
						sql`${transaction.transaction_at}::date = ${row.date}`,
						eq(transaction.amount, row.amount),
						sql`${transaction.description} IS NOT DISTINCT FROM ${row.description ?? null}`,
					),
				)
				.limit(1);

			const [insertedRow] = await tx
				.insert(importRow)
				.values({
					...classifiedRow,
					profile_id: row.profile_id ?? null,
					status: duplicate ? "duplicates" : classifiedRow.status,
					import_batch_id: batch.id,
					duplicate_transaction_id: duplicate?.id ?? null,
				})
				.returning();

			rows.push(insertedRow);
		}

		return { batch, rows };
	});
}

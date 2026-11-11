import {
	autoSyncConf,
	importBatch,
	importProfile,
	importRow,
	NIS_ID,
	transaction,
} from "@piga/db/schema";
import * as drizzleOrm from "drizzle-orm";
import { upsertClassificationRules } from "../lib/upsert-classification-rules.ts";
import { validateMergeable } from "../lib/validate-import-rows.ts";
import type { ImportRowAction } from "../types.ts";

export const merge: ImportRowAction = async ({ db, rows }) => {
	validateMergeable(rows);

	for (const row of rows) {
		if (!row.date) {
			throw new Error(`Import row ${row.id} has no date`);
		}

		if (!row.amount) {
			throw new Error(`Import row ${row.id} has no amount`);
		}
	}

	if (rows.length === 0) {
		throw new Error("No import rows provided");
	}

	const batchId = rows[0].import_batch_id;
	let batchCurrencyId: number | undefined;
	let transactionTypeId: number;

	if (batchId != null) {
		if (rows.some((row) => row.import_batch_id !== batchId)) {
			throw new Error("All import rows must belong to the same batch");
		}

		const [batch] = await db
			.select()
			.from(importBatch)
			.where(drizzleOrm.eq(importBatch.id, batchId))
			.limit(1);

		if (!batch) {
			throw new Error("Import batch not found");
		}

		const [profile] = await db
			.select()
			.from(importProfile)
			.where(drizzleOrm.eq(importProfile.id, batch.import_profile_id))
			.limit(1);

		if (!profile) {
			throw new Error("Import profile not found");
		}

		batchCurrencyId = profile.currency_id;
		transactionTypeId = profile.transaction_type_id;
	} else {
		if (
			rows.some(
				(row) => row.import_batch_id != null || row.max_sync_table_id == null,
			)
		) {
			throw new Error("Sync merge requires MAX sync rows");
		}

		const [config] = await db
			.select({ transaction_type_id: autoSyncConf.transaction_type_id })
			.from(autoSyncConf)
			.where(drizzleOrm.eq(autoSyncConf.srcName, "Max"))
			.limit(1);

		if (config?.transaction_type_id == null) {
			throw new Error("MAX sync configuration has no transaction type");
		}

		transactionTypeId = config.transaction_type_id;
	}

	const transactionValues = rows.map((row) => {
		const currencyId = batchCurrencyId ?? row.currency_id;
		if (currencyId == null) {
			throw new Error(`Import row ${row.id} has no currency`);
		}

		return {
			max_sync_table_id: row.max_sync_table_id,
			profile_id: row.profile_id ?? null,
			tag_id: row.tag_id,
			transaction_at: new Date(`${row.date}T00:00:00.000Z`),
			project_id: row.project_id,
			category_id: row.category_id,
			sub_category_id: row.sub_category_id,
			currency_id: currencyId,
			transaction_type_id: transactionTypeId,
			amount: row.amount,
			amount_nis:
				batchId != null
					? currencyId === NIS_ID
						? row.amount
						: null
					: row.amount_nis,
			description: row.description,
		};
	});

	const newTransactions = await db
		.insert(transaction)
		.values(transactionValues)
		.returning({
			id: transaction.id,
		});

	const transactionCase = drizzleOrm.sql.join(
		rows.map(
			(row, index) =>
				drizzleOrm.sql`WHEN ${importRow.id} = ${row.id} THEN ${newTransactions[index].id}`,
		),
		drizzleOrm.sql` `,
	);

	await db
		.update(importRow)
		.set({
			transaction_id: drizzleOrm.sql`CASE ${transactionCase} ELSE NULL END::integer`,
			status: "merged",
			touched_by_user: new Date(),
			updated_at: new Date(),
		})
		.where(
			drizzleOrm.inArray(
				importRow.id,
				rows.map((row) => row.id),
			),
		);

	// Note: we don't need to await here
	upsertClassificationRules(db, rows);

	return {
		action: "merge",
		rows: newTransactions,
	};
};

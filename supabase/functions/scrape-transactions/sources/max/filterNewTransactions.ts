import {
	type AutoSyncConf,
	type MaxSyncTableInsert,
	maxSyncTable,
} from "@piga/db/schema";
import { gte, inArray, or } from "drizzle-orm";
import type { createDb } from "../../../_shared/db.ts";

const amountFields = new Set<keyof MaxSyncTableInsert>([
	"actual_payment_amount",
	"original_amount",
	"promotion_amount",
	"deal_amount_ils",
]);

function comparable(key: keyof MaxSyncTableInsert, value: unknown): unknown {
	if (value === undefined || value === null) return null;
	if (value instanceof Date) return value.getTime();
	// PostgreSQL numeric(12, 2) rounds amounts and returns decimal strings.
	if (amountFields.has(key)) return Number(value).toFixed(2);
	return value;
}

export async function filterNewTransactions(
	db: ReturnType<typeof createDb>,
	transactions: readonly MaxSyncTableInsert[],
	lookbackDays: AutoSyncConf["lookback_days"],
): Promise<MaxSyncTableInsert[]> {
	if (transactions.length === 0) return [];

	const start = new Date();
	start.setUTCHours(0, 0, 0, 0);
	start.setUTCDate(start.getUTCDate() - lookbackDays);

	const existing = await db
		.select()
		.from(maxSyncTable)
		.where(
			or(
				gte(maxSyncTable.purchase_date, start),
				inArray(
					maxSyncTable.ref_nbr,
					transactions.map((row) => row.ref_nbr),
				),
			),
		);

	const existingByReference = new Map(
		existing.map((row) => [row.ref_nbr, row]),
	);
	const newTransactions: MaxSyncTableInsert[] = [];

	for (const transaction of transactions) {
		const stored = existingByReference.get(transaction.ref_nbr);
		if (!stored) {
			newTransactions.push(transaction);
			continue;
		}

		const keys = Object.keys(transaction) as (keyof MaxSyncTableInsert)[];

		const changedKeys = keys.filter(
			(key) =>
				key !== "id" &&
				key !== "created_at" &&
				transaction[key] !== undefined &&
				comparable(key, stored[key]) !== comparable(key, transaction[key]),
		);

		if (changedKeys.length > 0) {
			console.log("MAX transaction changed", {
				stored,
				incoming: transaction,
				changedKeys,
			});
		}
	}

	return newTransactions;
}

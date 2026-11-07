import { type AutoSyncConf, currency, profile } from "@piga/db/schema";
import type { createDb } from "../../../_shared/db.ts";
import { loadCredential } from "../../lib/loadCredential.ts";
import { filterNewTransactions } from "./filterNewTransactions.ts";
import { login } from "./login.ts";
import { mapMaxTransaction } from "./mapping.ts";
import { parseTransaction } from "./parseTransaction.ts";
import { scrape } from "./scrape.ts";
import { sync } from "./sync.ts";

// TODO: this should be a generic code with a base class
// so the paret index will be able to genercly call the main logic for all srcs
export async function syncMax(
	db: ReturnType<typeof createDb>,
	config: AutoSyncConf,
): Promise<Record<string, unknown>[]> {
	if (config.srcName.toLowerCase() !== "max") {
		throw new Error("Expected MAX source configuration");
	}

	const username = config.public_config.username;
	if (typeof username !== "string" || !username.trim()) {
		throw new Error("MAX username is required");
	}
	if (!Number.isInteger(config.lookback_days) || config.lookback_days <= 0) {
		throw new Error("MAX lookback days must be a positive integer");
	}

	const end = new Date();
	const start = new Date(end);
	start.setUTCDate(start.getUTCDate() - config.lookback_days);
	if (!Number.isFinite(start.getTime())) {
		throw new Error("MAX lookback days exceed the supported date range");
	}

	const startDate = start.toISOString().slice(0, 10);
	const endDate = end.toISOString().slice(0, 10);

	const credentials = await loadCredential(db, config);

	if (
		typeof credentials.password !== "string" ||
		credentials.password.trim().length === 0
	) {
		throw new Error("MAX password is required");
	}

	const cookie = await login(username, credentials.password);

	const rawTransactions = await scrape({
		cookie,
		startDate,
		endDate,
		date: endDate,
	});

	const transactions = parseTransaction(rawTransactions);

	const newRows = await filterNewTransactions(
		db,
		transactions,
		config.lookback_days,
	);

	if (newRows.length === 0) return transactions;

	const newReferences = new Set(newRows.map((row) => row.ref_nbr));

	const newTransactions = transactions.filter((transaction) =>
		newReferences.has(transaction.ref_nbr),
	);

	const [currencies, profiles] = await Promise.all([
		db
			.select({ id: currency.id, iso_numeric_code: currency.iso_numeric_code })
			.from(currency),
		db
			.select({ id: profile.id, credit_card: profile.credit_card })
			.from(profile),
	]);

	const mapped = mapMaxTransaction(newTransactions, { currencies, profiles });

	const importsByReference = new Map(
		mapped.map((row) => [row.refNbr, row.importRow]),
	);

	return sync(
		db,
		newRows.map((transaction) => ({
			transaction,
			// biome-ignore lint/style/noNonNullAssertion: we added a check beforehand
			mappedImportRow: importsByReference.get(transaction.ref_nbr)!,
		})),
	);
}

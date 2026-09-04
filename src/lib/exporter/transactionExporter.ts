import jsonExport from "jsonexport/dist";
import type { FetchRelatedRecords } from "ra-core";
import { downloadCSV } from "ra-core";
import type {
	Currency,
	Transaction,
	TransactionCategory,
	TransactionProject,
	TransactionTag,
} from "#/db/schema";
import { getExchangeRates } from "#/lib/exchange-rate";
import { categoryOptionText } from "#/lib/form/categoryOptionText";
import { currencyOptionText } from "#/lib/form/currencyOptionText";
import { projectOptionText } from "#/lib/form/projectOptionText";
import { tagOptionText } from "#/lib/form/tagOptionText";
import { toDateString } from "#/lib/format/toDateString";

export const transactionExporter = async (
	transactions: Transaction[],
	fetchRelatedRecords: FetchRelatedRecords,
) => {
	const [projects, categories, currencies, tags] = await Promise.all([
		fetchRelatedRecords<TransactionProject>(
			transactions,
			"project_id",
			"transaction_project",
		),
		fetchRelatedRecords<TransactionCategory>(
			transactions,
			"category_id",
			"transaction_category",
		),
		fetchRelatedRecords<Currency>(transactions, "currency_id", "currency"),
		fetchRelatedRecords<TransactionTag>(
			transactions,
			"tag_id",
			"transaction_tag",
		),
	]);

	// Get the date range of the transactions
	const dates = transactions.map((transaction) =>
		toDateString(transaction.created_at),
	);

	const fromDate = dates.reduce((a, b) => (a < b ? a : b));
	const toDate = dates.reduce((a, b) => (a > b ? a : b));

	const exchangeRates = await getExchangeRates(fromDate, toDate);

	const rateMap = new Map(
		exchangeRates.map((rate) => [
			`${rate.iso_code}:${rate.date}`,
			Number(rate.rate),
		]),
	);

	const transactionsForExport = transactions.map((transaction) => {
		const currency = currencies[transaction.currency_id];
		const date = toDateString(transaction.created_at);

		let amountInNis: number | "" = "";

		if (currency?.iso_code === "ILS") {
			amountInNis = Number(transaction.amount);
		} else if (currency?.iso_code) {
			const rate = rateMap.get(`${currency.iso_code}:${date}`);

			if (rate !== undefined) {
				amountInNis = Number(transaction.amount) * rate;
			}
		}

		return {
			id: transaction.id,
			amount: transaction.amount,
			amount_in_nis: amountInNis === "" ? "" : amountInNis.toFixed(2),
			currency: currency ? currencyOptionText(currency) : "",
			project: transaction.project_id
				? projectOptionText(projects[transaction.project_id])
				: "",
			category: transaction.category_id
				? categoryOptionText(categories[transaction.category_id])
				: "",
			tag: transaction.tag_id ? tagOptionText(tags[transaction.tag_id]) : "",
			description: transaction.description ?? "",
			created_at: transaction.created_at,
		};
	});

	jsonExport(
		transactionsForExport,
		{
			headers: [
				"id",
				"amount",
				"amount_in_nis",
				"currency",
				"project",
				"category",
				"tag",
				"description",
				"created_at",
			],
		},
		(err, csv) => {
			if (err) {
				throw err;
			}

			downloadCSV(csv, "transactions");
		},
	);
};

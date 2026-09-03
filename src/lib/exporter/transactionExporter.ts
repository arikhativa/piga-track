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
import { categoryOptionText } from "#/lib/form/categoryOptionText";
import { currencyOptionText } from "#/lib/form/currencyOptionText";
import { projectOptionText } from "#/lib/form/projectOptionText";
import { tagOptionText } from "#/lib/form/tagOptionText";

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

	const transactionsForExport = transactions.map((transaction) => ({
		id: transaction.id,
		amount: transaction.amount,
		currency: currencies[transaction.currency_id]
			? currencyOptionText(currencies[transaction.currency_id])
			: "",
		project: transaction.project_id
			? projectOptionText(projects[transaction.project_id])
			: "",
		category: transaction.category_id
			? categoryOptionText(categories[transaction.category_id])
			: "",
		tag: transaction.tag_id ? tagOptionText(tags[transaction.tag_id]) : "",
		description: transaction.description ?? "",
		created_at: transaction.created_at,
	}));

	jsonExport(
		transactionsForExport,
		{
			headers: [
				"id",
				"amount",
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

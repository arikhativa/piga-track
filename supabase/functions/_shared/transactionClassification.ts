import {
	type ImportRowInsert,
	transactionClassificationRule,
} from "@piga/db/schema";
import type { DB } from "./types.ts";

const normalize = (value: string) => value.trim().toLowerCase();

export async function loadTransactionClassifier(db: DB) {
	const rules = await db
		.select({
			textToFind: transactionClassificationRule.text_to_find,
			categoryId: transactionClassificationRule.category_id,
			tagId: transactionClassificationRule.tag_id,
			action: transactionClassificationRule.action,
		})
		.from(transactionClassificationRule);

	const normalizedRules = rules.map((rule) => ({
		...rule,
		normalizedText: normalize(rule.textToFind),
	}));

	return (row: ImportRowInsert): ImportRowInsert => {
		const description = normalize(row.description ?? "");

		// Case-insensitive, full-string match only.
		const matchedRule = description
			? normalizedRules.find((rule) => rule.normalizedText === description)
			: undefined;

		return {
			...row,
			category_id:
				row.category_id ??
				(matchedRule?.action === "addData" ? matchedRule.categoryId : null) ??
				null,
			tag_id:
				row.tag_id ??
				(matchedRule?.action === "addData" ? matchedRule.tagId : null) ??
				null,
			status:
				row.status === "duplicates"
					? "duplicates"
					: matchedRule?.action === "dropRow"
						? "dropped"
						: (row.status ?? "pending"),
		};
	};
}

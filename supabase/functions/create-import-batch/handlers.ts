import {
	importBatch,
	importRow,
	transaction,
	transactionClassificationRule,
} from "@piga/db/schema";
import { and, eq, sql } from "drizzle-orm";
import type { DB } from "../_shared/types.ts";
import type { CreateImportBatchRequest } from "./schema.ts";

const normalize = (value: string) => value.trim().toLowerCase();

export function createImportBatch(db: DB, body: CreateImportBatchRequest) {
	return db.transaction(async (tx) => {
		const [batch] = await tx
			.insert(importBatch)
			.values({
				batch_name: body.batch_name,
				import_profile_id: body.import_profile_id,
			})
			.returning();

		const rules = await tx
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

		const rows = [];

		for (const row of body.rows) {
			const description = normalize(row.description ?? "");

			// Case-insensitive, full-string match only.
			const matchedRule = description
				? normalizedRules.find((rule) => rule.normalizedText === description)
				: undefined;

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
					...row,
					category_id:
						row.category_id ??
						(matchedRule?.action === "addData"
							? matchedRule.categoryId
							: null) ??
						null,
					tag_id:
						row.tag_id ??
						(matchedRule?.action === "addData" ? matchedRule.tagId : null) ??
						null,
					status: duplicate
						? "duplicates"
						: matchedRule?.action === "dropRow"
							? "dropped"
							: "pending",
					import_batch_id: batch.id,
					duplicate_transaction_id: duplicate?.id ?? null,
				})
				.returning();

			rows.push(insertedRow);
		}

		return { batch, rows };
	});
}

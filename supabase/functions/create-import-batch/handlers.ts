import { and, eq, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../../../src/db/schema.ts";
import {
  importBatch,
  importRow,
  transaction,
  transactionClassificationRule,
} from "../../../src/db/schema.ts";
import type { CreateImportBatchInput } from "./schema.ts";

type Db = PostgresJsDatabase<typeof schema>;

const normalize = (value: string) => value.trim().toLowerCase();

export function createImportBatch(
  db: Db,
  body: CreateImportBatchInput,
) {
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
        ? normalizedRules.find(
          (rule) => rule.normalizedText === description,
        )
        : undefined;

      const [duplicate] = await tx
        .select({ id: transaction.id })
        .from(transaction)
        .where(
          and(
            sql`${transaction.transaction_at}::date = ${row.date}`,
            eq(transaction.amount, row.amount),
          ),
        )
        .limit(1);

      const [insertedRow] = await tx
        .insert(importRow)
        .values({
          ...row,
          category_id: row.category_id ?? matchedRule?.categoryId ?? null,
          tag_id: row.tag_id ?? matchedRule?.tagId ?? null,
          import_batch_id: batch.id,
          duplicate_transaction_id: duplicate?.id ?? null,
        })
        .returning();

      rows.push(insertedRow);
    }

    return { batch, rows };
  });
}

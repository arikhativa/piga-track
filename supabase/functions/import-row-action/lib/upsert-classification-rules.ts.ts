import { sql } from "drizzle-orm";
import { transactionClassificationRule } from "../../../../src/db/schema.ts";
import { DB } from "../../../types.ts";

export async function upsertClassificationRules(
  db: DB,
  rows: {
    description: string | null;
    category_id: number | null;
    tag_id: number | null;
  }[],
) {
  const rules = new Map<
    string,
    {
      text_to_find: string;
      category_id: number | null;
      tag_id: number | null;
    }
  >();

  for (const row of rows) {
    const description = row.description?.trim().toLowerCase();

    if (
      !description ||
      (row.category_id == null && row.tag_id == null)
    ) {
      continue;
    }

    rules.set(description, {
      text_to_find: description,
      category_id: row.category_id,
      tag_id: row.tag_id,
    });
  }

  const values = [...rules.values()];

  if (values.length === 0) return;

  await db
    .insert(transactionClassificationRule)
    .values(values)
    .onConflictDoUpdate({
      target: transactionClassificationRule.text_to_find,
      set: {
        category_id: sql`coalesce(excluded.category_id, ${transactionClassificationRule.category_id})`,
        tag_id: sql`coalesce(excluded.tag_id, ${transactionClassificationRule.tag_id})`,
      },
    });
}
import { eq, inArray, sql } from "drizzle-orm";

import {
  importBatch,
  importProfile,
  importRow,
  transaction,
} from "../../../../src/db/schema.ts";
import { validatePending } from "../lib/validate-import-rows.ts";
import type { ImportRowAction } from "../types.ts";
import { updateBatchStatus } from "../lib/update-batch-status.ts";

export const merge: ImportRowAction = async ({
  db,
  rows,
  profileId,
}) => {
  validatePending(rows);

  for (const row of rows) {
    if (!row.date) {
      throw new Error(`Import row ${row.id} has no date`);
    }

    if (!row.amount) {
      throw new Error(`Import row ${row.id} has no amount`);
    }
  }

  const batchId = rows[0].import_batch_id;

  const [batch] = await db
    .select()
    .from(importBatch)
    .where(eq(importBatch.id, batchId))
    .limit(1);

  if (!batch) {
    throw new Error("Import batch not found");
  }

  const [profile] = await db
    .select()
    .from(importProfile)
    .where(eq(importProfile.id, batch.import_profile_id))
    .limit(1);

  if (!profile) {
    throw new Error("Import profile not found");
  }

  const transactionValues = rows.map((row) => ({
    profile_id: profileId,
    tag_id: row.tag_id,
    transaction_at: new Date(`${row.date}T00:00:00.000Z`),
    project_id: row.project_id,
    category_id: row.category_id,
    currency_id: profile.currency_id,
    transaction_type_id: profile.transaction_type_id,
    amount: row.amount!,
    description: row.description,
  }));

  const newTransactions = await db
    .insert(transaction)
    .values(transactionValues)
    .returning({
      id: transaction.id,
    });

  const transactionCase = sql.join(
    rows.map(
      (row, index) =>
        sql`WHEN ${importRow.id} = ${row.id} THEN ${newTransactions[index].id}`,
    ),
    sql` `,
  );

  await db
    .update(importRow)
    .set({
      transaction_id: sql`CASE ${transactionCase} ELSE NULL END::integer`,
      status: "merged",
      updated_at: new Date(),
    })
    .where(inArray(importRow.id, rows.map((row) => row.id)));

  await updateBatchStatus(db, batchId);

  return {
    action: "merge",
    rows: newTransactions,
  };
};

import { inArray } from "drizzle-orm";

import { importRow, transaction } from "../../../../src/db/schema.ts";
import type { ImportRow } from "../../../../src/db/schema.ts";
import type { ImportRowAction } from "../types.ts";
import { updateBatchStatus } from "../lib/update-batch-status.ts";

function validateUndoable(rows: ImportRow[]) {
  for (const row of rows) {
    if (row.status !== "merged" && row.status !== "dropped") {
      throw new Error(
        `Import row ${row.id} cannot be undone from status ${row.status}`,
      );
    }
  }
}

export const undo: ImportRowAction = async ({ db, rows }) => {
  validateUndoable(rows);

  const transactionIds = rows
    .filter((row) => row.status === "merged")
    .map((row) => row.transaction_id)
    .filter((id): id is number => id !== null);

  await db
    .update(importRow)
    .set({
      status: "pending",
      transaction_id: null,
      updated_at: new Date(),
    })
    .where(inArray(importRow.id, rows.map((row) => row.id)));

  if (transactionIds.length > 0) {
    await db
      .delete(transaction)
      .where(inArray(transaction.id, transactionIds));
  }

  const batchId = rows[0].import_batch_id;

  await updateBatchStatus(db, batchId);

  return {
    action: "undo",
    rows,
  };
};

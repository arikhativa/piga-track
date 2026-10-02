import type { ImportRow } from "../../../../src/db/schema.ts";

export function validateSameBatch(rows: ImportRow[]) {
  if (rows.length === 0) {
    throw new Error("No import rows provided");
  }

  const batchId = rows[0].import_batch_id;

  if (rows.some((row) => row.import_batch_id !== batchId)) {
    throw new Error("All import rows must belong to the same batch");
  }

  return batchId;
}

export function validatePending(rows: ImportRow[]) {
  for (const row of rows) {
    if (row.status !== "pending") {
      throw new Error(`Import row ${row.id} is not pending`);
    }
  }
}

export function validateMerged(rows: ImportRow[]) {
  for (const row of rows) {
    if (row.status !== "merged") {
      throw new Error(`Import row ${row.id} is not merged`);
    }
  }
}

import { bulkUpdateImportRows } from "../lib/bulk-update.ts";
import type { ImportRowAction } from "../types.ts";

export const setStatus: ImportRowAction = async ({
  db,
  rows,
  value,
}) => {
  if (
    value !== "pending" &&
    value !== "merged" &&
    value !== "dropped"
  ) {
    throw new Error("Invalid status");
  }

  await bulkUpdateImportRows(
    db,
    rows.map((row) => row.id),
    { status: value },
  );

  return {
    action: "set_status",
    rows,
  };
};

import { bulkUpdateImportRows } from "../lib/bulk-update.ts";
import type { ImportRowAction } from "../types.ts";

export const setCategory: ImportRowAction = async ({
  db,
  rows,
  value,
}) => {
  if (typeof value === "string") {
    throw new Error("Category ID must be a number");
  }

  await bulkUpdateImportRows(
    db,
    rows.map((row) => row.id),
    { category_id: value },
  );

  return {
    action: "set_category",
    rows,
  };
};

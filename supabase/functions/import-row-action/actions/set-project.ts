import { bulkUpdateImportRows } from "../lib/bulk-update.ts";
import type { ImportRowAction } from "../types.ts";

export const setProject: ImportRowAction = async ({
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
    { project_id: value },
  );

  return {
    action: "set_project",
    rows,
  };
};

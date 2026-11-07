import { bulkUpdateImportRows } from "../lib/bulk-update.ts";
import type { ImportRowAction } from "../types.ts";

export const hideRows: ImportRowAction = async ({ db, rows }) => {
	if (rows.length === 0) {
		throw new Error("No import rows provided");
	}

	const updatedRows = await bulkUpdateImportRows(
		db,
		rows.map((row) => row.id),
		{
			// Explicit hiding must also fall outside a list's previously computed cutoff.
			touched_by_user: new Date(0),
		},
	);

	return {
		action: "hide_rows",
		rows: updatedRows,
	};
};

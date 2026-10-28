import { bulkUpdateImportRows } from "../lib/bulk-update.ts";
import { upsertClassificationRules } from "../lib/upsert-classification-rules.ts";
import type { ImportRowAction } from "../types.ts";

export const setStatus: ImportRowAction = async ({ db, rows, value }) => {
	if (value !== "pending" && value !== "merged" && value !== "dropped") {
		throw new Error("Invalid status");
	}

	await bulkUpdateImportRows(
		db,
		rows.map((row) => row.id),
		{ status: value },
	);

	if (value === "dropped") {
		upsertClassificationRules(db, rows, "dropRow");
	}

	return {
		action: "set_status",
		rows,
	};
};

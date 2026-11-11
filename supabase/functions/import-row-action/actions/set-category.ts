import { transactionCategory } from "@piga/db/schema";
import { eq } from "drizzle-orm";
import { bulkUpdateImportRows } from "../lib/bulk-update.ts";
import type { ImportRowAction } from "../types.ts";

export const setCategory: ImportRowAction = async ({ db, rows, value }) => {
	if (
		value !== null &&
		(typeof value !== "number" || !Number.isInteger(value) || value <= 0)
	) {
		throw new Error("Category ID must be a positive integer or null");
	}

	if (value !== null) {
		const [category] = await db
			.select()
			.from(transactionCategory)
			.where(eq(transactionCategory.id, value))
			.limit(1);

		if (!category || category.parent_id !== null) {
			throw new Error("Select a top-level category");
		}
	}

	const updatedRows = await bulkUpdateImportRows(
		db,
		rows.map((row) => row.id),
		{ category_id: value, sub_category_id: null },
	);

	return {
		action: "set_category",
		rows: updatedRows,
	};
};

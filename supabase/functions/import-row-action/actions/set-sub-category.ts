import { transactionCategory } from "@piga/db/schema";
import { eq } from "drizzle-orm";
import { bulkUpdateImportRows } from "../lib/bulk-update.ts";
import type { ImportRowAction } from "../types.ts";

export const setSubCategory: ImportRowAction = async ({ db, rows, value }) => {
	if (
		value !== null &&
		(typeof value !== "number" || !Number.isInteger(value) || value <= 0)
	) {
		throw new Error("Subcategory ID must be a positive integer or null");
	}

	if (value !== null) {
		const [category] = await db
			.select()
			.from(transactionCategory)
			.where(eq(transactionCategory.id, value))
			.limit(1);

		if (!category || category.parent_id === null) {
			throw new Error("Select a category that has a parent");
		}

		if (rows.some((row) => row.category_id !== category.parent_id)) {
			throw new Error(
				"Subcategory must belong to the selected parent category of every row",
			);
		}
	}

	const updatedRows = await bulkUpdateImportRows(
		db,
		rows.map((row) => row.id),
		{ sub_category_id: value },
	);

	return {
		action: "set_sub_category",
		rows: updatedRows,
	};
};

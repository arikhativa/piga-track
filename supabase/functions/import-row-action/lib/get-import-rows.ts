import { inArray } from "drizzle-orm";
import { importRow } from "../../../../src/db/schema.ts";
import type { DB } from "../../../types.ts";

export async function getImportRows(db: DB, ids: number[]) {
	const rows = await db
		.select()
		.from(importRow)
		.where(inArray(importRow.id, ids));

	if (rows.length !== ids.length) {
		throw new Error("One or more import rows were not found");
	}

	return rows;
}

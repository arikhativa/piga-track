import { importRow } from "@piga/db/schema";
import { inArray } from "drizzle-orm";
import type { DB } from "../../_shared/types.ts";

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

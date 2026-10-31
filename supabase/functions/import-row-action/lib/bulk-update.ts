import { importRow } from "@piga/db/schema";
import type { ImportRowStatusEnum } from "@piga/db/types";
import { inArray } from "drizzle-orm";
import type { DB } from "../../_shared/types.ts";

type BulkUpdateData = {
	category_id?: number | null;
	project_id?: number | null;
	tag_id?: number | null;
	status?: ImportRowStatusEnum;
};

export function bulkUpdateImportRows(
	db: DB,
	ids: number[],
	data: BulkUpdateData,
) {
	return db
		.update(importRow)
		.set({
			...data,
			updated_at: new Date(),
		})
		.where(inArray(importRow.id, ids))
		.returning();
}

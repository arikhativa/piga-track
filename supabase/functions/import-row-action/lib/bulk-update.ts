import { inArray } from "drizzle-orm";
import { DB } from "../../../types.ts";
import { importRow, ImportRowStatusEnum } from "../../../../src/db/schema.ts";

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

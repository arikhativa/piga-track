import type { ImportRow } from "@piga/db/types";
import type { DB } from "../_shared/types.ts";
import type { ImportRowActionInput } from "./schema.ts";

export type ImportRowActionContext = Omit<
	ImportRowActionInput,
	"import_row_ids" | "action"
> & {
	db: DB;
	rows: ImportRow[];
};

export type ImportRowActionResult = {
	action: string;
	rows: unknown[];
};

export type ImportRowAction = (
	context: ImportRowActionContext,
) => Promise<ImportRowActionResult>;

import type { ImportRow } from "../../../src/db/schema.ts";
import type { DB } from "../../types.ts";
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

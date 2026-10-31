import type { TransactionCategory } from "@piga/db/types";

export function categoryOptionText(proj: TransactionCategory) {
	return `${proj.value}`;
}

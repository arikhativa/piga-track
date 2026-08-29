import type { TransactionCategory } from "#/db/schema";

export function categoryOptionText(proj: TransactionCategory) {
	return `${proj.value}`;
}

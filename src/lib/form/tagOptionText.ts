import type { TransactionTag } from "#/db/schema";

export function tagOptionText(tag: TransactionTag) {
	return `${tag.value}`;
}

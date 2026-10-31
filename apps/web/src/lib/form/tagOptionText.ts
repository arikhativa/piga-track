import type { TransactionTag } from "@piga/db/types";

export function tagOptionText(tag: TransactionTag) {
	return `${tag.value}`;
}

import type { TransactionProject } from "@piga/db/types";

export function projectOptionText(proj: TransactionProject) {
	return `${proj.value}`;
}

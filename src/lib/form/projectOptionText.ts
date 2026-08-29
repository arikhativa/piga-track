import type { TransactionProject } from "#/db/schema";

export function projectOptionText(proj: TransactionProject) {
	return `${proj.value}`;
}

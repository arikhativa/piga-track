import type { TransactionProject } from "#/db/schema";
import { useTransactionCosts } from "#/hooks/use-transaction-costs";

// TODO: if this is slow then we should create one api call for all pots
// const result = await db
// 	.select({
// 		id: transactionType.id,
// 		name: transactionType.name,
// 		base: transactionType.base,
// 		balance: sql<number>`
// 			${transactionType.base}
// 			+ COALESCE(SUM(${transaction.amount}), 0)
// 		`,
// 	})
// 	.from(transactionType)
// 	.leftJoin(
// 		transaction,
// 		and(
// 			eq(transaction.transaction_type_id, transactionType.id),
// 			eq(transaction.profile_id, profileId),
// 		),
// 	)
// 	.groupBy(
// 		transactionType.id,
// 		transactionType.name,
// 		transactionType.base,
// 	);

export const ProjectCosts = ({ record }: { record?: TransactionProject }) => {
	const { data: balance, isPending, error } = useTransactionCosts(record?.id);

	if (isPending) return "...";
	if (error) return "Error";

	return Math.abs(balance ?? 0).toFixed(2);
};

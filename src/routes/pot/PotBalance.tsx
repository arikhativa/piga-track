import { useGetList } from "ra-core";
import type { TransactionType } from "#/db/schema";

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

export const PotBalance = ({ record }: { record?: TransactionType }) => {
	const { data: transactions, isPending } = useGetList("transaction", {
		filter: {
			transaction_type_id: record?.id,
		},
	});

	if (isPending) return "...";

	const balance =
		(record?.base ?? 0) +
		(transactions?.reduce((sum, transaction) => sum + transaction.amount, 0) ??
			0);

	return balance;
};

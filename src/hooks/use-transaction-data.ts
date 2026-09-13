import { useGetList } from "ra-core";
import type { Transaction } from "#/db/schema";

export const useTransactionData = ({ from, to }: { from: Date; to: Date }) => {
	return useGetList<Transaction>("transaction", {
		filter: {
			"transaction_at@gte": from.toISOString(),
			"transaction_at@lte": to.toISOString(),
		},
		sort: {
			field: "transaction_at",
			order: "ASC",
		},
	});
};

import { useGetList } from "ra-core";
import type { Transaction } from "#/db/schema";

export const useTransactionData = ({ from, to }: { from: Date; to: Date }) => {
	return useGetList<Transaction>("transaction", {
		filter: {
			"created_at@gte": from.toISOString(),
			"created_at@lte": to.toISOString(),
		},
		sort: {
			field: "created_at",
			order: "ASC",
		},
	});
};

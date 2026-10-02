import { useQuery } from "@tanstack/react-query";
import type { TransactionProject } from "#/db/schema";
import { useProjectTransactions } from "#/hooks/use-project-transactions";

export const useProjectCosts = (record?: TransactionProject) => {
	const {
		data: transactions,
		isPending,
		error,
	} = useProjectTransactions(record?.id);

	return useQuery({
		queryKey: ["project-costs", record?.id],
		queryFn: () => {
			if (!transactions?.length) {
				return 0;
			}

			const sum = transactions.reduce((sum, transaction) => {
				if (transaction.amount_nis === null) {
					return sum;
				}

				return sum + Number(transaction.amount_nis);
			}, 0);

			return Math.abs(sum);
		},
		enabled: Boolean(record?.id) &&
			!isPending &&
			!error,
	});
};

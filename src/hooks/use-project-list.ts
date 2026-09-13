import { useGetList } from "ra-core";
import type { TransactionProject } from "#/db/schema";

export const useProjectList = () => {
	return useGetList<TransactionProject>("transaction_project", {
		pagination: {
			page: 1,
			perPage: 100,
		},
	});
};

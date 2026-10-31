import type { TransactionProject } from "@piga/db/types";
import { useGetList } from "ra-core";

export const useProjectList = () => {
	return useGetList<TransactionProject>("transaction_project", {
		pagination: {
			page: 1,
			perPage: 100,
		},
	});
};

import type { TransactionCategory } from "@piga/db/types";
import { useGetList } from "ra-core";
import { categoryListParams, categoryListStaleTime } from "#/lib/category-list";

export function useCategoryList() {
	return useGetList<TransactionCategory>(
		"transaction_category",
		categoryListParams,
		{ staleTime: categoryListStaleTime },
	);
}

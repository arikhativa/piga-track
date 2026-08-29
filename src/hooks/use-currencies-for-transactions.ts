import { useGetList } from "ra-core";
import type { Currency } from "#/db/schema";

export function useCurrenciesForTransactions() {
	return useGetList<Currency>("currency", {
		pagination: {
			page: 1,
			perPage: 100,
		},
	});
}

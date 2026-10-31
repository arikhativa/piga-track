import type { Currency } from "@piga/db/types";
import { useGetList } from "ra-core";

export function useCurrencyList() {
	return useGetList<Currency>("currency", {
		pagination: {
			page: 1,
			perPage: 100,
		},
	});
}

import { useQuery } from "@tanstack/react-query";
import {
	callExchangeRateProvider,
	getExchangeRate,
	insertExchangeRate,
} from "#/lib/exchange-rate";

export const useExchangeRate = (isoCode: string, date: string) => {
	return useQuery({
		queryKey: ["exchange-rate", isoCode, date],
		queryFn: async () => {
			const rate = await getExchangeRate(isoCode, date);

			if (rate === null) {
				const newRate = await callExchangeRateProvider(isoCode, date);

				return insertExchangeRate(isoCode, date, newRate);
			}

			return rate;
		},
		enabled: Boolean(isoCode && date),
	});
};

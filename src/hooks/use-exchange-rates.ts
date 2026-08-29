import { useQuery } from "@tanstack/react-query";
import { BASE_CURRENCY } from "#/lib/constant";

type ExchangeRateRequest = {
	isoCode: string;
	dates: string[];
};

type FrankfurterRate = {
	date: string;
	base: string;
	quote: string;
	rate: number;
};

type RateKey = `${string}:${string}`;

export function useExchangeRates(requests: ExchangeRateRequest[]) {
	return useQuery({
		queryKey: ["exchange-rates", requests],

		enabled: requests.length > 0,

		queryFn: async () => {
			const rates: Record<RateKey, number> = {};

			await Promise.all(
				requests
					.filter(({ isoCode }) => isoCode !== BASE_CURRENCY)
					.map(async ({ isoCode, dates }) => {
						if (!dates.length) return;

						const sortedDates = [...dates].sort();

						const from = sortedDates[0];
						const to = sortedDates.at(-1)!;

						const params = new URLSearchParams({
							from,
							to,
							base: isoCode,
							quotes: BASE_CURRENCY,
						});

						const response = await fetch(
							`https://api.frankfurter.dev/v2/rates?${params}`,
						);

						if (!response.ok) {
							throw new Error(`Failed to fetch ${isoCode} exchange rates`);
						}

						const data: FrankfurterRate[] = await response.json();

						for (const rate of data) {
							rates[`${isoCode}:${rate.date}`] = rate.rate;
						}
					}),
			);
			return rates;
		},

		staleTime: Infinity,
	});
}

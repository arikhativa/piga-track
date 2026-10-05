import type { QueryClient } from "@tanstack/react-query";
import { BASE_CURRENCY } from "#/lib/constant";
import { supabaseClient } from "#/lib/supabaseClient";

const RATE_PROVIDER_URL = "https://api.frankfurter.dev/v2" as const;

type ExchangeRateProviderResponse = {
	rate: number;
};

export const callExchangeRateProvider = async (
	isoCode: string,
	date: string,
): Promise<number> => {
	const response = await fetch(
		`${RATE_PROVIDER_URL}/rate/${isoCode}/ILS?date=${date}`,
	);

	if (!response.ok) {
		throw new Error(`Frankfurter API error: ${response.status}`);
	}

	const data: ExchangeRateProviderResponse = await response.json();

	return data.rate;
};

type ExchangeRateProviderRangeResponse = {
	date: string;
	base: string;
	quote: string;
	rate: number;
};

export type ExchangeRate = {
	isoCode: string;
	date: string;
	rate: number;
};

export const callExchangeRateProviderRange = async ({
	isoCodes,
	fromDate,
	toDate,
}: {
	isoCodes: string[];
	fromDate: string;
	toDate: string;
}): Promise<ExchangeRate[]> => {
	if (!isoCodes.length) {
		return [];
	}

	const params = new URLSearchParams({
		base: BASE_CURRENCY,
		quotes: isoCodes.join(","),
		from: fromDate,
		to: toDate,
	});

	const response = await fetch(
		`${RATE_PROVIDER_URL}/rates?${params}`,
	);

	if (!response.ok) {
		throw new Error(
			`Frankfurter API error: ${response.status}`,
		);
	}

	const data: ExchangeRateProviderRangeResponse[] = await response.json();

	return data.map((item) => ({
		isoCode: item.quote,
		date: item.date,
		rate: 1 / item.rate,
	}));
};

export const getExchangeRateFromDB = async (isoCode: string, date: string) => {
	const { data, error } = await supabaseClient
		.from("exchange_rate")
		.select("rate")
		.eq("iso_code", isoCode)
		.eq("date", date)
		.maybeSingle();

	if (error) {
		throw error;
	}

	return data?.rate ?? null;
};

export const getExchangeRatesFromDB = async (
	isoCodes: string[],
	fromDate: string,
	toDate: string,
) => {
	const { data, error } = await supabaseClient
		.from("exchange_rate")
		.select("iso_code, date, rate")
		.in("iso_code", isoCodes)
		.gte("date", fromDate)
		.lte("date", toDate)
		.order("date", { ascending: true });

	if (error) {
		throw error;
	}

	return data;
};

export const insertExchangeRates = async (
	rates: {
		isoCode: string;
		date: string;
		rate: number;
	}[],
) => {
	if (!rates.length) {
		return [];
	}

	const { data, error } = await supabaseClient
		.from("exchange_rate")
		.upsert(
			rates.map(({ isoCode, date, rate }) => ({
				iso_code: isoCode,
				date,
				rate,
			})),
			{
				onConflict: "date,iso_code",
			},
		)
		.select();

	if (error) {
		throw error;
	}

	return data;
};

export const insertExchangeRate = async (
	isoCode: string,
	date: string,
	rate: number,
) => {
	const { data, error } = await supabaseClient
		.from("exchange_rate")
		.upsert(
			{
				iso_code: isoCode,
				date,
				rate,
			},
			{
				onConflict: "date,iso_code",
			},
		)
		.select()
		.single();

	if (error) {
		throw error;
	}

	return data;
};

export const resolveAmountNis = ({
	amount,
	isoCode,
	rate,
}: {
	amount: number;
	isoCode: string;
	rate: number | null;
}): number | null => {
	if (isoCode === BASE_CURRENCY) {
		return amount;
	}

	if (rate === null) {
		return null;
	}

	return Math.abs(amount) * rate;
};

export async function getExchangeRate(
	{ queryClient, isoCode, dateString }: {
		queryClient: QueryClient;
		isoCode: string;
		dateString: string;
	},
): Promise<number | null> {
	return queryClient.query({
		queryKey: ["exchange-rate", isoCode, dateString],
		queryFn: async (): Promise<number | null> => {
			if (isoCode === BASE_CURRENCY) {
				return 1;
			}
			const existing = await getExchangeRateFromDB(
				isoCode,
				dateString,
			);

			if (existing !== null) {
				return existing;
			}

			try {
				const newRate = await callExchangeRateProvider(
					isoCode,
					dateString,
				);

				await insertExchangeRate(
					isoCode,
					dateString,
					newRate,
				);

				return newRate;
			} catch {
				return null;
			}
		},
	});
}

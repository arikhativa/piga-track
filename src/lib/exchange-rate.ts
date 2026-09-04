import { supabaseClient } from "#/lib/supabaseClient";

type ExchangeRateProviderResponse = {
	rate: number;
};

export const callExchangeRateProvider = async (
	isoCode: string,
	date: string,
): Promise<number> => {
	const response = await fetch(
		`https://api.frankfurter.dev/v2/rate/${isoCode}/ILS?date=${date}`,
	);

	if (!response.ok) {
		throw new Error(`Frankfurter API error: ${response.status}`);
	}

	const data: ExchangeRateProviderResponse = await response.json();

	return data.rate;
};

export const getExchangeRate = async (isoCode: string, date: string) => {
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

export const getExchangeRates = async (fromDate: string, toDate: string) => {
	const { data, error } = await supabaseClient
		.from("exchange_rate")
		.select("*")
		.gte("date", fromDate)
		.lte("date", toDate)
		.order("date", { ascending: true });

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

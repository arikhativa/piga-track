import { BASE_CURRENCY } from "#/lib/constant";
import { supabaseClient } from "#/lib/supabaseClient";

type ExchangeRateProviderResponse = {
	rate: number;
};

// TODO maybe some of these can be local and not exported
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

export const resolveAmountNis = async ({
	amount,
	isoCode,
	date,
}: {
	amount: number;
	isoCode: string;
	date: Date;
}): Promise<number | null> => {
	if (isoCode === BASE_CURRENCY) {
		return amount;
	}

	const dateString = date.toISOString().slice(0, 10);

	let rate = await getExchangeRate(isoCode, dateString);

	if (rate === null) {
		try {
			rate = await callExchangeRateProvider(isoCode, dateString);
			await insertExchangeRate(isoCode, dateString, rate);
		} catch {
			return null;
		}
	}

	return Math.abs(amount) * rate;
};

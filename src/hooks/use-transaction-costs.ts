import { useGetList } from "ra-core";
import type { Transaction } from "#/db/schema";
import { useCurrenciesForTransactions } from "#/hooks/use-currencies-for-transactions";
import { useExchangeRates } from "#/hooks/use-exchange-rates";
import { BASE_CURRENCY } from "#/lib/constant";

export function useTransactionCosts(projectId?: number) {
	const {
		data: transactions,
		isPending: transactionsPending,
		error: transactionsError,
	} = useGetList<Transaction>("transaction", {
		filter: {
			project_id: projectId,
		},
	});

	const {
		data: currencies,
		isPending: currenciesPending,
		error: currenciesError,
	} = useCurrenciesForTransactions();

	const exchangeRateRequests =
		transactions && currencies
			? currencies
					.filter((currency) => currency.iso_code !== BASE_CURRENCY)
					.map((currency) => ({
						isoCode: currency.iso_code,
						dates: transactions
							.filter((transaction) => transaction.currency_id === currency.id)
							.map(
								(transaction) =>
									new Date(transaction.created_at).toISOString().split("T")[0],
							),
					}))
			: [];

	const ratesQuery = useExchangeRates(exchangeRateRequests);

	if (transactionsPending || currenciesPending || ratesQuery.isPending) {
		return {
			data: undefined,
			isPending: true,
			error: undefined,
		};
	}

	if (transactionsError || currenciesError || ratesQuery.error) {
		return {
			data: undefined,
			isPending: false,
			error: transactionsError ?? currenciesError ?? ratesQuery.error,
		};
	}

	const rates = ratesQuery.data ?? {};

	const balance = transactions?.reduce((sum, transaction) => {
		const amount = Number(transaction.amount);

		const currency = currencies?.find(
			(currency) => currency.id === transaction.currency_id,
		);

		if (!currency || currency.iso_code === BASE_CURRENCY) {
			return sum + amount;
		}

		const transactionDate = new Date(transaction.created_at)
			.toISOString()
			.split("T")[0];

		const rate = rates[`${currency.iso_code}:${transactionDate}`];

		if (!rate) return sum;

		return sum + amount * rate;
	}, 0);

	return {
		data: balance ?? 0,
		isPending: false,
		error: undefined,
	};
}

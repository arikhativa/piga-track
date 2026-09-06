import { useQuery } from "@tanstack/react-query";
import type { TransactionProject } from "#/db/schema";
import { useCurrencyList } from "#/hooks/use-currency-list";
import { useProjectTransactions } from "#/hooks/use-project-transactions";
import { getExchangeRates } from "#/lib/exchange-rate";
import { toDateString } from "#/lib/format/toDateString";

export const useProjectCosts = (record?: TransactionProject) => {
	const { data: currencies, isPending: currenciesPending } = useCurrencyList();

	const {
		data: transactions,
		isPending: transactionsPending,
		error: transactionsError,
	} = useProjectTransactions(record?.id);

	return useQuery({
		queryKey: ["project-costs", record?.id],
		queryFn: async () => {
			if (!transactions?.length || !currencies) {
				return 0;
			}

			const dates = transactions.map((transaction) =>
				toDateString(transaction.created_at),
			);

			const fromDate = dates.reduce((a, b) => (a < b ? a : b));
			const toDate = dates.reduce((a, b) => (a > b ? a : b));

			const exchangeRates = await getExchangeRates(fromDate, toDate);

			const currencyMap = new Map(
				currencies.map((currency) => [currency.id, currency]),
			);

			const rateMap = new Map(
				exchangeRates.map((rate) => [
					`${rate.iso_code}:${rate.date}`,
					Number(rate.rate),
				]),
			);

			const sum = transactions.reduce((sum, transaction) => {
				const amount = Number(transaction.amount);
				const currency = currencyMap.get(transaction.currency_id);

				if (currency?.iso_code === "ILS") {
					return sum + amount;
				}

				if (!currency?.iso_code) {
					return sum;
				}

				const date = toDateString(transaction.created_at);
				const rate = rateMap.get(`${currency.iso_code}:${date}`);

				if (rate === undefined) {
					return sum;
				}

				return sum + amount * rate;
			}, 0);

			return Math.abs(sum);
		},
		enabled:
			Boolean(record?.id) &&
			!currenciesPending &&
			!transactionsPending &&
			!transactionsError,
	});
};

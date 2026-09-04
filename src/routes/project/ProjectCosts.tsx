import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { TransactionProject } from "#/db/schema";
import { useCurrencyList } from "#/hooks/use-currency-list";
import { useProjectTransactions } from "#/hooks/use-project-transactions";
import { getExchangeRates } from "#/lib/exchange-rate";
import { toDateString } from "#/lib/format/toDateString";

// TODO: if this is slow then we should create one api call for all pots
// const result = await db
// 	.select({
// 		id: transactionType.id,
// 		name: transactionType.name,
// 		base: transactionType.base,
// 		balance: sql<number>`
// 			${transactionType.base}
// 			+ COALESCE(SUM(${transaction.amount}), 0)
// 		`,
// 	})
// 	.from(transactionType)
// 	.leftJoin(
// 		transaction,
// 		and(
// 			eq(transaction.transaction_type_id, transactionType.id),
// 			eq(transaction.profile_id, profileId),
// 		),
// 	)
// 	.groupBy(
// 		transactionType.id,
// 		transactionType.name,
// 		transactionType.base,
// 	);

export const ProjectCosts = ({ record }: { record?: TransactionProject }) => {
	const { data: currencies } = useCurrencyList();

	const { data: transactions } = useProjectTransactions(record?.id);

	const { data: exchangeRates } = useQuery({
		queryKey: ["exchange-rates", record?.id],
		queryFn: async () => {
			if (!transactions?.length) {
				return [];
			}

			const dates = transactions.map((transaction) =>
				toDateString(transaction.created_at),
			);

			const fromDate = dates.reduce((a, b) => (a < b ? a : b));
			const toDate = dates.reduce((a, b) => (a > b ? a : b));

			return getExchangeRates(fromDate, toDate);
		},
		enabled: Boolean(transactions?.length),
	});

	const sum = useMemo(() => {
		if (!transactions || !currencies || !exchangeRates) {
			return 0;
		}

		const currencyMap = new Map(
			currencies.map((currency) => [currency.id, currency]),
		);

		const rateMap = new Map(
			exchangeRates.map((rate) => [
				`${rate.iso_code}:${rate.date}`,
				Number(rate.rate),
			]),
		);

		return transactions.reduce((sum, transaction) => {
			const amount = Number(transaction.amount);

			const currency = currencyMap.get(transaction.currency_id);

			// NIS is already the base currency.
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
	}, [transactions, currencies, exchangeRates]);

	return Math.abs(sum).toFixed(2);
};

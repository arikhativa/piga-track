import { useGetList } from "ra-core";
import type { Currency, Transaction, TransactionProject } from "#/db/schema";

export function useProjectCurrencyTotals(projectId?: TransactionProject["id"]) {
	const transactionsQuery = useGetList<Transaction>("transaction", {
		filter: {
			project_id: projectId,
		},
		pagination: {
			page: 1,
			perPage: 1000,
		},
	});

	const currenciesQuery = useGetList<Currency>("currency");

	const currencyById = new Map(
		(currenciesQuery.data ?? []).map((currency) => [
			currency.id,
			currency.symbol,
		]),
	);

	const totals: Record<string, number> = {};

	for (const transaction of transactionsQuery.data ?? []) {
		const symbol = currencyById.get(transaction.currency_id);

		if (!symbol) continue;

		const amount = Number(transaction.amount);

		totals[symbol] = (totals[symbol] ?? 0) + amount;
	}

	for (const aaa of Object.entries(totals)) {
		const [currency, total] = aaa;
		totals[currency] = Number(total.toFixed(2));
	}

	return {
		...transactionsQuery,
		data: totals,
	};
}

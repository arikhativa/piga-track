import { supabaseClient } from "#/lib/supabaseClient";

export type DashboardBalance = {
	balance: number;
	expenses: number;
	income: number;
};

export type DashboardDateRange = {
	from: Date;
	to: Date;
};

export async function getBalance(
	range: DashboardDateRange,
): Promise<DashboardBalance> {
	const { data, error } = await supabaseClient
		.from("transaction")
		.select("amount_nis")
		.gte("transaction_at", range.from.toISOString())
		.lt("transaction_at", range.to.toISOString());

	if (error) {
		throw error;
	}

	let income = 0;
	let expenses = 0;

	for (const transaction of data ?? []) {
		const amount = Number(transaction.amount_nis ?? 0);

		if (amount > 0) {
			income += amount;
		} else if (amount < 0) {
			expenses += Math.abs(amount);
		}
	}

	return {
		income,
		expenses,
		balance: income - expenses,
	};
}

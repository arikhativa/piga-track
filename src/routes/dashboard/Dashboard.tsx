import { useMemo } from "react";
import { useTransactionData } from "#/hooks/use-transaction-data";
import { BarChartCard } from "#/routes/dashboard/BarChart";

export function Dashboard() {
	const from = new Date("2026-06-01");
	const to = new Date("2026-10-31");
	const { data, isPending, error } = useTransactionData({
		from,
		to,
	});

	const chartData = useMemo(() => {
		if (isPending || error || !data?.length) return [];

		const months = new Map<string, number>();

		for (const transaction of data) {
			const date = new Date(transaction.created_at);

			const month = date.toLocaleString("en-US", {
				month: "long",
			});

			months.set(month, (months.get(month) ?? 0) + transaction.amount);
		}

		return Array.from(months, ([month, value]) => ({
			month,
			value,
		}));
	}, [data, isPending, error]);

	return (
		<div className="w-200">
			<BarChartCard title="Transactions By Month" data={chartData} />
		</div>
	);
}

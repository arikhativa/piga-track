import { useMemo } from "react";
import { useTransactionData } from "#/hooks/use-transaction-data";
import { BarChartCard } from "#/routes/dashboard/BarChart";

export function Dashboard() {
	const to = new Date();
	const from = new Date();

	from.setMonth(from.getMonth() - 5);
	from.setDate(1);
	from.setHours(0, 0, 0, 0);

	to.setHours(23, 59, 59, 999);

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
			value: value * -1,
		}));
	}, [data, isPending, error]);

	return (
		<div className="w-full justify-center flex items-center h-full">
			<div className="w-full  max-h-200">
				<BarChartCard title="Expenses By Month" data={chartData} />
			</div>
		</div>
	);
}

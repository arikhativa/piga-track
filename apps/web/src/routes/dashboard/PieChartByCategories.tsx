import { Minus, Plus } from "lucide-react";
import { Spinner } from "#/components/admin/spinner";
import { PieChartCard } from "#/components/charts/PieChartCard";
import { useDashboardData } from "#/hooks/use-dashboard-data";
import type { DateRange } from "#/hooks/use-dashboard-date-range";

export function PieChartByCategories({
	dateRange,
	type,
}: {
	dateRange: DateRange;
	type: "income" | "expenses";
}) {
	const { data, isSuccess } = useDashboardData(dateRange);

	if (!isSuccess) return <Spinner />;

	const categories =
		type === "income" ? data.incomeCategories : data.expenseCategories;

	return (
		<PieChartCard
			palette={type}
			title={type === "income" ? "Income" : "Expenses"}
			icon={
				type === "income" ? (
					<Plus className=" bg-green-200 p-1 text-green-600 rounded-full" />
				) : (
					<Minus className="bg-pink-200 p-1 text-pink-600 rounded-full" />
				)
			}
			data={Object.fromEntries(
				categories.map(({ category, amount }) => [category, amount]),
			)}
		/>
	);
}

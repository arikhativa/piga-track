import { Spinner } from "#/components/admin/spinner";
import { BarChartMultiple } from "#/components/charts/BarChartMultiple";
import { useDashboardData } from "#/hooks/use-dashboard-data";
import type { DateRange } from "#/hooks/use-dashboard-date-range";

export function BarChartSection({ dateRange }: { dateRange: DateRange }) {
	const { data, isSuccess } = useDashboardData(dateRange);

	if (!isSuccess) return <Spinner />;

	return (
		<BarChartMultiple
			data={data.monthly.map((month) => ({
				...month,
				expenses: Math.abs(month.expenses),
			}))}
		/>
	);
}

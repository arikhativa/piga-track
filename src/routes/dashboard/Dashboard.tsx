import { useDashboardDateRange } from "#/hooks/use-dashboard-date-range";
import { Balance } from "#/routes/dashboard/Balance";
import { DashboardFilters } from "#/routes/dashboard/DashboardFilters";

export function Dashboard() {
	const [dateRange, setDateRange] = useDashboardDateRange();

	return (
		<article>
			<DashboardFilters
				value={dateRange}
				onChange={setDateRange}
			/>
			<Balance dateRange={dateRange} />
		</article>
	);
}
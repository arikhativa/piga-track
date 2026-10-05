import { Separator } from "#/components/ui/separator";
import { useDashboardDateRange } from "#/hooks/use-dashboard-date-range";
import { Balance } from "#/routes/dashboard/Balance";
import { BalanceByCategory } from "#/routes/dashboard/BalanceByCategory";
import { BarChartSection } from "#/routes/dashboard/BarChartSection";
import { DashboardFilters } from "#/routes/dashboard/DashboardFilters";

export function Dashboard() {
	const [dateRange, setDateRange] = useDashboardDateRange();

	return (
		<article className="pt-10 flex flex-col gap-4">
			<DashboardFilters value={dateRange} onChange={setDateRange} />
			<Separator />
			<Balance dateRange={dateRange} />
			<Separator />
			<BalanceByCategory dateRange={dateRange} />
			<Separator />
			<BarChartSection dateRange={dateRange} />
		</article>
	);
}

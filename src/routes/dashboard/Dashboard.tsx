import { Translate } from "ra-core";
import { Breadcrumb } from "#/components/admin";
import { Separator } from "#/components/ui/separator";
import { useDashboardDateRange } from "#/hooks/use-dashboard-date-range";
import { Balance } from "#/routes/dashboard/Balance";
import { BalanceByCategory } from "#/routes/dashboard/BalanceByCategory";
import { BarChartFilter } from "#/routes/dashboard/BarChartFilter";
import { BarChartSection } from "#/routes/dashboard/BarChartSection";
import { DashboardFilters } from "#/routes/dashboard/DashboardFilters";
import { DashboardSection } from "#/routes/dashboard/DashboardSection";

export function Dashboard() {
	const [dateRange, setDateRange] = useDashboardDateRange();

	return (
		<>
			<Breadcrumb>
				<Breadcrumb.PageItem>
					<Translate i18nKey="ra.page.dashboard"></Translate>
				</Breadcrumb.PageItem>
			</Breadcrumb>
			<article className="py-6 flex flex-col gap-4">
				<DashboardFilters value={dateRange} onChange={setDateRange} />
				<div className="flex flex-col gap-4 md:grid grid-cols-2 md:gap-8">
					<div className="flex flex-col gap-4 md:flex md:flex-col md:gap-8">
						<Separator />
						<Balance dateRange={dateRange} />
						<Separator />
						<BalanceByCategory dateRange={dateRange} />
					</div>
					<BarChartSection dateRange={dateRange} />
				</div>

				<div className="flex flex-col md:grid grid-cols-2 md:gap-8 ">
					<DashboardSection title="Compare by category">
						<BarChartFilter filterType="category" dateRange={dateRange} />
					</DashboardSection>
					<DashboardSection title="Compare by content">
						<BarChartFilter filterType="tag" dateRange={dateRange} />
					</DashboardSection>
				</div>
			</article>
		</>
	);
}

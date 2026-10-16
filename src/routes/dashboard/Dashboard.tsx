import { Translate } from "ra-core";
import { Breadcrumb } from "#/components/admin";
import { Separator } from "#/components/ui/separator";
import { useDashboardDateRange } from "#/hooks/use-dashboard-date-range";
import { useIsMobile } from "#/hooks/use-mobile";
import { Balance } from "#/routes/dashboard/Balance";
import { BalanceByCategory } from "#/routes/dashboard/BalanceByCategory";
import { BarChartFilter } from "#/routes/dashboard/BarChartFilter";
import { BarChartSection } from "#/routes/dashboard/BarChartSection";
import { DashboardFilters } from "#/routes/dashboard/DashboardFilters";
import { DashboardSection } from "#/routes/dashboard/DashboardSection";

export function Dashboard() {
	const [dateRange, setDateRange] = useDashboardDateRange();
	const isMobile = useIsMobile();

	return (
		<>
			<Breadcrumb>
				<Breadcrumb.PageItem>
					<Translate i18nKey="ra.page.dashboard"></Translate>
				</Breadcrumb.PageItem>
			</Breadcrumb>
			<article className="py-6 flex flex-col gap-4">
				<DashboardFilters value={dateRange} onChange={setDateRange} />
				<div className="flex flex-col gap-4 ">
					<div className="flex flex-col md:flex-row md:justify-center gap-4">
						{isMobile && <Separator />}
						<Balance dateRange={dateRange} />
						<Separator orientation={!isMobile ? "vertical" : "horizontal"} />
						<div className="flex-1">
							<BarChartSection dateRange={dateRange} />
						</div>
					</div>
					<Separator className="hidden md:block" orientation="vertical" />

					<BalanceByCategory className={""} dateRange={dateRange} />
				</div>

				<div className="flex flex-col md:grid grid-cols-2 md:gap-8 ">
					<DashboardSection title="Category">
						<BarChartFilter filterType="category" dateRange={dateRange} />
					</DashboardSection>
					<DashboardSection title="Content">
						<BarChartFilter filterType="tag" dateRange={dateRange} />
					</DashboardSection>
				</div>
			</article>
		</>
	);
}

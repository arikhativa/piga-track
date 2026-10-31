import { useNavigate } from "react-router-dom";
import { Spinner } from "#/components/admin/spinner";
import { BarChartMultiple } from "#/components/charts/BarChartMultiple";
import { useDashboardData } from "#/hooks/use-dashboard-data";
import type { DateRange } from "#/hooks/use-dashboard-date-range";

export function BarChartSection({ dateRange }: { dateRange: DateRange }) {
	const { data, isSuccess } = useDashboardData(dateRange);
	const navigate = useNavigate();

	const handleBarClick = (month: string, type: "income" | "expenses") => {
		const [year, monthNumber] = month.split("-").map(Number);
		const monthString = String(monthNumber).padStart(2, "0");
		const from = `${year}-${monthString}-01`;
		const lastDay = new Date(year, monthNumber, 0).getDate();
		const to = `${year}-${monthString}-${String(lastDay).padStart(2, "0")}`;

		const filter = {
			"transaction_at@gte": from,
			"transaction_at@lte": to,
			amountType: type === "expenses" ? "negative" : "positive",
		};
		const displayedFilters = {
			"transaction_at@gte": true,
			"transaction_at@lte": true,
			amountType: true,
		};
		const params = new URLSearchParams({
			displayedFilters: JSON.stringify(displayedFilters),
			filter: JSON.stringify(filter),
			order: "DESC",
			page: "1",
			perPage: "50",
			sort: "transaction_at",
		});

		navigate(`/transaction?${params.toString()}`);
	};

	if (!isSuccess) return <Spinner />;

	return (
		<BarChartMultiple
			data={data.monthly.map((month) => ({
				...month,
				expenses: Math.abs(month.expenses),
			}))}
			onBarClick={handleBarClick}
		/>
	);
}

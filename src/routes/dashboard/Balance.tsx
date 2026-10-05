import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Spinner } from "#/components/ui/spinner";
import { useDashboardData } from "#/hooks/use-dashboard-data";
import type { DateRange } from "#/hooks/use-dashboard-date-range";
import { formatNIS } from "#/lib/format/formatNIS";

function BalanceCard({ title, amount }: { title: string; amount?: string }) {
	return (
		<Card className="">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				{amount === undefined ? (
					<Spinner />
				) : (
					<p className="text-end text-2xl font-semibold">{amount}</p>
				)}
			</CardContent>
		</Card>
	);
}

export function Balance({ dateRange }: { dateRange: DateRange }) {
	const { data, isLoading } = useDashboardData(dateRange);

	const { balance = 0, expenses = 0, income = 0 } = data ?? {};

	return (
		<div className="grid gap-4 md:grid-cols-3">
			<BalanceCard
				title={"Expenses"}
				amount={isLoading ? undefined : formatNIS(expenses)}
			/>
			<BalanceCard
				title={"Income"}
				amount={isLoading ? undefined : formatNIS(income)}
			/>
			<BalanceCard
				title={"Balance"}
				amount={isLoading ? undefined : formatNIS(balance)}
			/>
		</div>
	);
}

import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { Spinner } from "#/components/ui/spinner";
import { useDashboardData } from "#/hooks/use-dashboard-data";
import type { DateRange } from "#/hooks/use-dashboard-date-range";
import { formatNIS } from "#/lib/format/formatNIS";

function BalanceCard({
	title,
	amount,
	className,
}: {
	className?: string;
	title: string;
	amount?: string;
}) {
	return (
		<Card className={cn(className, "flex-1 border-2")}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="w-full">
				{amount === undefined ? (
					<Spinner />
				) : (
					<p className="text-end md:text-2xl text-xl font-semibold">{amount}</p>
				)}
			</CardContent>
		</Card>
	);
}

export function Balance({ dateRange }: { dateRange: DateRange }) {
	const { data, isLoading } = useDashboardData(dateRange);

	const { balance = 0, expenses = 0, income = 0 } = data ?? {};

	return (
		<div className="flex gap-4 items-center ">
			<BalanceCard
				className="border-expense"
				title={"Expenses"}
				amount={isLoading ? undefined : formatNIS(expenses)}
			/>
			<BalanceCard
				className="border-income"
				title={"Income"}
				amount={isLoading ? undefined : formatNIS(income)}
			/>
			<Separator orientation="vertical" />
			<BalanceCard
				className="border-balance"
				title={"Balance"}
				amount={isLoading ? undefined : formatNIS(balance)}
			/>
		</div>
	);
}

import { cn } from "cn";
import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Item, ItemContent, ItemTitle } from "#/components/ui/item";
import { Spinner } from "#/components/ui/spinner";
import { useDashboardData } from "#/hooks/use-dashboard-data";
import type { DateRange } from "#/hooks/use-dashboard-date-range";
import { formatNIS } from "#/lib/format/formatNIS";

function CategoryItem({ title, amount }: { title: string; amount: number }) {
	return (
		<Item className="bg-background border-2 border-border">
			<ItemContent className="flex  flex-row justify-between">
				<ItemTitle>{title}</ItemTitle>
				<p>{formatNIS(amount)}</p>
			</ItemContent>
		</Item>
	);
}

function BalanceCard({
	title,
	className,
	children,
	icon,
}: { title: string; icon?: ReactNode } & React.ComponentProps<"div">) {
	return (
		<Card className={className}>
			<CardHeader className="flex justify-between">
				<CardTitle>{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

export function BalanceByCategory({ dateRange }: { dateRange: DateRange }) {
	const { data, isSuccess } = useDashboardData(dateRange);

	if (!isSuccess) return <Spinner />;

	const { incomeCategories, expenseCategories } = data;

	const incomeList = incomeCategories.map(({ category, amount }) => (
		<CategoryItem key={category} title={category} amount={amount} />
	));

	const expenseList = expenseCategories.map(({ category, amount }) => (
		<CategoryItem key={category} title={category} amount={amount} />
	));

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<BalanceCard
				icon={<Minus className=" bg-pink-200 p-1 text-pink-600 rounded-full" />}
				title="Expenses"
			>
				{expenseList}
			</BalanceCard>

			<BalanceCard
				icon={
					<Plus className=" bg-green-200 p-1 text-green-600 rounded-full" />
				}
				title="Income"
			>
				{incomeList}
			</BalanceCard>
		</div>
	);
}

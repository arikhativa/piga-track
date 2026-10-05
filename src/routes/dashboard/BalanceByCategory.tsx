import type { PropsWithChildren } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Item, ItemContent, ItemTitle } from "#/components/ui/item";
import { Spinner } from "#/components/ui/spinner";
import { useDashboardData } from "#/hooks/use-dashboard-data";
import type { DateRange } from "#/hooks/use-dashboard-date-range";
import { formatNIS } from "#/lib/format/formatNIS";

function CategoryItem({ title, amount }: { title: string; amount: number }) {
	return (
		<Item className="bg-background">
			<ItemContent className="flex  flex-row justify-between">
				<ItemTitle>{title}</ItemTitle>
				<p>{formatNIS(amount)}</p>
			</ItemContent>
		</Item>
	);
}

function BalanceCard({
	title,
	children,
}: { title: string } & PropsWithChildren) {
	return (
		<Card className="">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
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
			<BalanceCard title="Income">{incomeList}</BalanceCard>

			<BalanceCard title="Expenses">{expenseList}</BalanceCard>
		</div>
	);
}

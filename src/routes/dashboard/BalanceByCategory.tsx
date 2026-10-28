import { cn } from "cn";
import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Item, ItemContent, ItemTitle } from "#/components/ui/item";
import { Spinner } from "#/components/ui/spinner";
import { useDashboardData } from "#/hooks/use-dashboard-data";
import type { DateRange } from "#/hooks/use-dashboard-date-range";
import { formatNIS } from "#/lib/format/formatNIS";

function CategoryItem({
	title,
	amount,
	isBoth,
	isIncome,
	categoryId,
	dateRange,
}: {
	isIncome: boolean;
	isBoth: boolean;
	title: string;
	amount: number;
	categoryId: number;
	dateRange: DateRange;
}) {
	const filter = {
		"transaction_at@gte": dateRange.from,
		"transaction_at@lte": dateRange.to,
		category_id: String(categoryId),
		// TODO we need to add seperate col for value
		// amountFilter: isBoth ? (isIncome ? "positive" : "negative") : undefined,
	};

	const displayedFilters = {
		"transaction_at@gte": true,
		"transaction_at@lte": true,
		category_id: true,
		// TODO we need to add seperate col for value
		// amountFilter: isBoth,
	};

	const params = new URLSearchParams({
		displayedFilters: JSON.stringify(displayedFilters),
		filter: JSON.stringify(filter),
		order: "DESC",
		page: "1",
		perPage: "50",
		sort: "transaction_at",
	});

	return (
		<Link to={`/transaction?${params.toString()}`}>
			<Item className="bg-background border-2 border-border">
				<ItemContent className="flex flex-row justify-between gap-4">
					<ItemTitle>{title}</ItemTitle>
					<p>{formatNIS(amount)}</p>
				</ItemContent>
			</Item>
		</Link>
	);
}

function BalanceCard({
	title,
	className,
	classNameContent,
	children,
	icon,
}: {
	title: string;
	icon?: ReactNode;
	classNameContent?: string;
} & React.ComponentProps<"div">) {
	return (
		<Card className={className}>
			<CardHeader className="flex justify-between  ">
				<CardTitle>{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent className={classNameContent}>{children}</CardContent>
		</Card>
	);
}

export function BalanceByCategory({
	dateRange,
	className,
}: {
	dateRange: DateRange;
	className?: string;
}) {
	const { data, isSuccess } = useDashboardData(dateRange);

	if (!isSuccess) return <Spinner />;

	const { incomeCategories, expenseCategories } = data;

	const incomeList = [...incomeCategories]
		.sort((a, b) => b.amount - a.amount)
		.map(({ category, amount, categoryId, isBoth }) => (
			<CategoryItem
				isIncome
				isBoth={!!isBoth}
				dateRange={dateRange}
				categoryId={categoryId}
				key={category}
				title={category}
				amount={amount}
			/>
		));

	const expenseList = [...expenseCategories]
		.sort((a, b) => b.amount - a.amount)
		.map(({ category, amount, categoryId, isBoth }) => (
			<CategoryItem
				isIncome={false}
				isBoth={!!isBoth}
				dateRange={dateRange}
				key={category}
				categoryId={categoryId}
				title={category}
				amount={amount}
			/>
		));

	return (
		<div
			className={cn("flex flex-col md:grid gap-4 md:grid-cols-3", className)}
		>
			<BalanceCard
				className="md:col-span-2 "
				classNameContent="md:grid md:grid-cols-2"
				icon={<Minus className="bg-pink-200 p-1 text-pink-600 rounded-full" />}
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

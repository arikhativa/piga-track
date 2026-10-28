import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

type MonthlyData = {
	month: string;
	income: number;
	expenses: number;
};

type BarChartMultipleProps = {
	data: MonthlyData[];
	onBarClick?: (month: string) => void;
};

const chartConfig = {
	income: {
		label: "Income",
		color: "var(--color-income-chart)",
	},
	expenses: {
		label: "Expenses",
		color: "var(--color-expense-chart)",
	},
} satisfies ChartConfig;

export function BarChartMultiple({ data, onBarClick }: BarChartMultipleProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Income & Expenses</CardTitle>
				<CardDescription>Last 6 months</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={data}>
						<CartesianGrid vertical={false} />

						<XAxis
							dataKey="month"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => {
								const [year, month] = value.split("-");
								return new Date(
									Number(year),
									Number(month) - 1,
								).toLocaleDateString("en-US", {
									month: "short",
								});
							}}
						/>

						<YAxis
							tickFormatter={(value) =>
								Number(value).toLocaleString("he-IL", {
									maximumFractionDigits: 0,
								})
							}
						/>

						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar
							dataKey="expenses"
							fill="var(--color-expenses)"
							radius={4}
							onClick={(entry) => {
								const month = (entry.payload as MonthlyData).month;
								onBarClick?.(month);
							}}
						/>

						<Bar
							dataKey="income"
							fill="var(--color-income)"
							radius={4}
							onClick={(entry) => {
								const month = (entry.payload as MonthlyData).month;
								onBarClick?.(month);
							}}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

export function BarChartMultiple({ data }: BarChartMultipleProps) {
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

						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="dashed" />}
						/>
						<Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />

						<Bar dataKey="income" fill="var(--color-income)" radius={4} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

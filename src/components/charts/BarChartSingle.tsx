"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "#/components/ui/chart";

type BarChartSingleData = {
	bucket: string;
	amount: number;
};

type BarChartSingleProps = {
	data: BarChartSingleData[];
	title?: string;
	description?: string;
};

const chartConfig = {
	amount: {
		label: "Amount",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export function BarChartSingle({
	data,
	title = "Transactions",
	description,
}: BarChartSingleProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>

			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={data}>
						<CartesianGrid vertical={false} />

						<XAxis
							dataKey="bucket"
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

						<Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

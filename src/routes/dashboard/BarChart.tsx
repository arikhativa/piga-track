"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartData = [
	{ month: "January", value: 186 },
	{ month: "February", value: 305 },
	{ month: "March", value: 237 },
	{ month: "April", value: 73 },
	{ month: "May", value: 209 },
	{ month: "June", value: 214 },
];

const chartConfig = {
	desktop: {
		label: "Amount",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

interface ChartData {
	month: string;
	value: number;
}

interface BarChartCard {
	title: string;
	desc?: string;
	config?: ChartConfig;
	data: ChartData[];
}

export function BarChartCard({ title, desc, config, data }: BarChartCard) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{desc ? <CardDescription>{desc}</CardDescription> : null}
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
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar dataKey="value" fill="var(--chart-1)" radius={8} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

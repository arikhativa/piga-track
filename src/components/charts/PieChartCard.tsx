import { LabelList, Pie, PieChart } from "recharts";

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

export const description = "A pie chart with a custom label";

interface PieChartCardProps {
	title: string;
	desc?: string;
	data: Record<string, number>;
}

const MAX_ITEMS = 5;

export function PieChartCard({ title, desc, data }: PieChartCardProps) {
	const entries = Object.entries(data).sort(
		([, a], [, b]) => Math.abs(b) - Math.abs(a),
	);

	const hasOther = entries.length > MAX_ITEMS;

	const top = entries.slice(0, hasOther ? MAX_ITEMS - 1 : MAX_ITEMS);
	const rest = entries.slice(hasOther ? MAX_ITEMS - 1 : MAX_ITEMS);

	const chartData = [
		...top.map(([name, value]) => ({
			name,
			value: Math.abs(value),
			fill: `var(--color-${name})`,
		})),
		...(rest.length > 0
			? [
					{
						name: "other",
						value: rest.reduce((sum, [, value]) => sum + Math.abs(value), 0),
						fill: "var(--color-other)",
					},
				]
			: []),
	];

	const chartConfig: ChartConfig = {};

	chartData.forEach(({ name }, index) => {
		chartConfig[name] = {
			label: name === "other" ? "Other" : name,
			color: `var(--chart-${index + 1})`,
		};
	});

	top.forEach(([name], index) => {
		chartConfig[name] = {
			label: name,
			color: `var(--chart-${index + 1})`,
		};
	});

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{desc ? <CardDescription>{desc}</CardDescription> : null}
			</CardHeader>

			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-62.5 px-0"
				>
					<PieChart>
						<ChartTooltip
							content={<ChartTooltipContent nameKey="value" hideLabel />}
						/>

						<Pie
							data={chartData}
							dataKey="value"
							labelLine={false}
							label={({ payload, ...props }) => (
								<text
									className="text-md"
									cx={props.cx}
									cy={props.cy}
									x={props.x}
									y={props.y}
									textAnchor={props.textAnchor}
									dominantBaseline={props.dominantBaseline}
									fill="var(--foreground)"
								>
									{payload.name}
								</text>
							)}
							nameKey="name"
						>
							<LabelList
								dataKey="value"
								className="fill-background"
								stroke="none"
								fontSize={12}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

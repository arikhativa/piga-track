import { useState } from "react";
import { Pie, PieChart } from "recharts";
import { cn } from "#/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	getColorKey,
} from "@/components/ui/chart";

interface PieChartCardProps {
	title: string;
	icon?: React.ReactNode;
	data: Record<string, number>;
	className?: string;
}

const MAX_ITEMS = 5;

export function PieChartCard({
	title,
	icon,
	data,
	className,
}: PieChartCardProps) {
	const [tooltipTrigger, setTooltipTrigger] = useState<"hover" | "click">(
		"hover",
	);
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
			fill: `var(--color-${getColorKey(name)})`,
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

	return (
		<Card className={cn("flex flex-col", className)}>
			<CardHeader className="flex justify-between">
				<CardTitle>{title}</CardTitle>
				{icon}
			</CardHeader>

			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square w-full max-w-100 min-w-0"
					onPointerDown={() => setTooltipTrigger("click")}
					onPointerMove={(event) => {
						if (event.pointerType === "mouse") setTooltipTrigger("hover");
					}}
				>
					<PieChart accessibilityLayer>
						<ChartTooltip
							trigger={tooltipTrigger}
							content={<ChartTooltipContent nameKey="name" labelKey="name" />}
						/>

						<Pie
							data={chartData}
							dataKey="value"
							outerRadius="65%"
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
									{payload.value.toLocaleString("he-IL", {
										maximumFractionDigits: 0,
									})}
								</text>
							)}
							nameKey="name"
						/>
						<ChartLegend
							content={
								<ChartLegendContent
									nameKey="name"
									className="flex-wrap gap-2"
								/>
							}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

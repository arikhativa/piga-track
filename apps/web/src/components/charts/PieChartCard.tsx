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
} from "@/components/ui/chart";

interface PieChartCardProps {
	title: string;
	icon?: React.ReactNode;
	data: Record<string, number>;
	className?: string;
	palette?: "income" | "expenses";
}

const MAX_ITEMS = 5;

// Tailwind 200, 400, 600, 800, 950; explicit values avoid theme-variable pruning.
const PALETTES = {
	income: [
		"oklch(92.5% 0.084 155.995)",
		"oklch(79.2% 0.209 151.711)",
		"oklch(62.7% 0.194 149.214)",
		"oklch(44.8% 0.119 151.328)",
		"oklch(26.6% 0.065 152.934)",
	],
	expenses: [
		"oklch(89.9% 0.061 343.231)",
		"oklch(71.8% 0.202 349.761)",
		"oklch(59.2% 0.249 0.584)",
		"oklch(45.9% 0.187 3.815)",
		"oklch(28.4% 0.109 3.907)",
	],
} as const;

export function PieChartCard({
	title,
	icon,
	data,
	className,
	palette,
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
		...top.map(([name, value], index) => ({
			name,
			colorKey: `category-${index}`,
			value: Math.abs(value),
			fill: `var(--color-category-${index})`,
		})),
		...(rest.length > 0
			? [
					{
						name: "Other",
						colorKey: "other",
						value: rest.reduce((sum, [, value]) => sum + Math.abs(value), 0),
						fill: "var(--color-other)",
					},
				]
			: []),
	];

	const chartConfig: ChartConfig = {};

	chartData.forEach(({ name, colorKey }, index) => {
		chartConfig[colorKey] = {
			label: name,
			color: palette ? PALETTES[palette][index] : `var(--chart-${index + 1})`,
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
							content={
								<ChartTooltipContent nameKey="colorKey" labelKey="colorKey" />
							}
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
									nameKey="colorKey"
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

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

interface ChartData {
	name: string;
	value: number;
	fill: string;
}

interface PieChartCard {
	title: string;
	desc?: string;
	data: ChartData[];
	config: ChartConfig;
}

export function PieChartCard({ title, desc, data, config }: PieChartCard) {
	return (
		<Card className="flex flex-col">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{desc ? <CardDescription>{desc}</CardDescription> : null}
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={config}
					className="mx-auto aspect-square max-h-62.5 px-0"
				>
					<PieChart>
						<ChartTooltip
							content={<ChartTooltipContent nameKey="value" hideLabel />}
						/>
						<Pie
							data={data}
							dataKey="value"
							labelLine={false}
							label={({ payload, ...props }) => {
								return (
									<text
										className="text-lg"
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
								);
							}}
							nameKey="name"
						>
							<LabelList
								dataKey="value"
								className="fill-background"
								stroke="none"
								fontSize={16}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

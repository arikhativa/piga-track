import { useRecordContext } from "ra-core";
import { useMemo } from "react";
import { PieChartCard } from "#/components/charts/PieChartCard";
import type { ChartConfig } from "#/components/ui/chart";
import { useProjectCurrencyTotals } from "#/hooks/use-project-currency-totals";

const BASE_CHART_CONFIG = {
	other: {
		label: "Other",
		color: "var(--chart-5)",
	},
};

export function ProjectStates() {
	const record = useRecordContext();

	const { data } = useProjectCurrencyTotals(
		record?.id == null ? undefined : Number(record.id),
	);

	const chartData = useMemo(() => {
		const entries = Object.entries(data ?? {}).sort(
			([, a], [, b]) => Math.abs(b) - Math.abs(a),
		);

		const top = entries.slice(0, 4);
		const rest = entries.slice(4);

		return [
			...top.map(([symbol, value]) => ({
				name: symbol,
				value: Math.abs(value),
				fill: `var(--color-${symbol})`,
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
	}, [data]);

	const chartConfig = useMemo<ChartConfig>(() => {
		if (!data) return BASE_CHART_CONFIG;

		const entries = Object.entries(data).sort(
			([, a], [, b]) => Math.abs(b) - Math.abs(a),
		);

		const top = entries.slice(0, 4);

		const config: ChartConfig = {
			...BASE_CHART_CONFIG,
		};

		top.forEach(([symbol], index) => {
			config[symbol] = {
				label: symbol,
				color: `var(--chart-${index + 1})`,
			};
		});

		return config;
	}, [data]);

	return (
		<PieChartCard
			title="Sum of cost by currency"
			data={chartData}
			config={chartConfig}
		/>
	);
}

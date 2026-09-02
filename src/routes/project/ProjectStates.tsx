import { useRecordContext } from "ra-core";
import { PieChartCard } from "#/components/charts/PieChartCard";
import { useProjectCurrencyTotals } from "#/hooks/use-project-currency-totals";

export function ProjectStates() {
	const record = useRecordContext();

	const { data } = useProjectCurrencyTotals(
		record?.id == null ? undefined : Number(record.id),
	);

	return <PieChartCard title="Sum of cost by currency" data={data} />;
}

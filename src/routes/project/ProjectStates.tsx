import { useRecordContext } from "ra-core";
import { PieChartCard } from "#/components/charts/PieChartCard";
import type { TransactionProject } from "#/db/schema";
import { useIsMobile } from "#/hooks/use-mobile";
import { useProjectCurrencyTotals } from "#/hooks/use-project-currency-totals";
import { ProjectCostNISCard } from "#/routes/project/ProjectCostNISCard";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

export function ProjectStates() {
	const record = useRecordContext<TransactionProject>();

	const { data } = useProjectCurrencyTotals(
		record?.id == null ? undefined : Number(record.id),
	);
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<Carousel className="mx-12 h-fit">
				<CarouselContent>
					<CarouselItem className="flex">
						<ProjectCostNISCard className={"w-full  m-4"} record={record} />
					</CarouselItem>
					<CarouselItem className="">
						<PieChartCard
							className={"m-4"}
							title="Sum of cost by currency"
							data={data}
						/>
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-4">
			<ProjectCostNISCard record={record} />
			<PieChartCard title="Sum of cost by currency" data={data} />
		</div>
	);
}

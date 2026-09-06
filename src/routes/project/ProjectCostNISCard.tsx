import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import type { TransactionProject } from "#/db/schema";
import { useProjectCosts } from "#/hooks/use-project-costs";
import { NIS } from "#/lib/constant";
import { Spinner } from "@/components/ui/spinner";
export const ProjectCostNISCard = ({
	record,
	className,
}: {
	record?: TransactionProject;
	className?: string;
}) => {
	const { data, isPending, isError } = useProjectCosts(record);

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Cost in NIS</CardTitle>
			</CardHeader>
			<CardContent className="h-full flex justify-center items-center">
				{isPending ? (
					<Spinner />
				) : isError ? (
					"Error"
				) : (
					<p className=" text-2xl">{`${data?.toFixed(2) ?? "0.00"} ${NIS}`}</p>
				)}
			</CardContent>
		</Card>
	);
};

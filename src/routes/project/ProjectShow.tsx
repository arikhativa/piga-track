import { TransactionDataTable } from "#/routes/(transaction)/TransactionDataTable";
import { ProjectStates } from "#/routes/project/ProjectStates";
import { ReferenceManyField, Show } from "@/components/admin";

export function ProjectShow() {
	return (
		<Show>
			<article className="space-y-4">
				<ProjectStates />
				<ReferenceManyField
					reference="transaction"
					target="project_id"
					sort={{ field: "created_at", order: "DESC" }}
				>
					<TransactionDataTable
						bulkActionButtons={false}
						colToHide={["project"]}
					/>
				</ReferenceManyField>
			</article>
		</Show>
	);
}

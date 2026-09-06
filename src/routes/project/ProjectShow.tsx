import { TransactionDataTable } from "#/routes/(transaction)/TransactionDataTable";
import { ProjectStates } from "#/routes/project/ProjectStates";
import { ProjectTitle } from "#/routes/project/ProjectTitle";
import { ReferenceManyField, Show } from "@/components/admin";

export function ProjectShow() {
	return (
		<Show title={<ProjectTitle />}>
			<article className="space-y-4">
				<ProjectStates />
				<ReferenceManyField
					reference="transaction"
					target="project_id"
					sort={{ field: "created_at", order: "DESC" }}
				>
					<TransactionDataTable
						disableSortCreatedAt
						bulkActionButtons={false}
						colToHide={["project", "category"]}
					/>
				</ReferenceManyField>
			</article>
		</Show>
	);
}

import { TransactionDataTable } from "#/routes/(transaction)/TransactionDataTable";
import { ProjectStates } from "#/routes/project/ProjectStates";
import { ReferenceManyField, Show } from "@/components/admin";

export function ProjectShow() {
	return (
		<Show>
			<article className="space-y-4">
				<ProjectStates />
				<p className="mt-12">Recent activity</p>
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

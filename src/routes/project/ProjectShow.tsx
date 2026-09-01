import { TransactionDataTable } from "#/routes/(transaction)/TransactionDataTable";
import { ReferenceManyField, Show } from "@/components/admin";

export function ProjectShow() {
	return (
		<Show>
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
		</Show>
	);
}

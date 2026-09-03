import { transactionExporter } from "#/lib/exporter/transactionExporter";
import { categoryOptionText } from "#/lib/form/categoryOptionText";
import { projectOptionText } from "#/lib/form/projectOptionText";
import { TransactionDataTable } from "#/routes/(transaction)/TransactionDataTable";
import { List, ReferenceInput, SelectInput } from "@/components/admin";

const transactionFilters = [
	<ReferenceInput
		key="project"
		source="project_id"
		reference="transaction_project"
	>
		<SelectInput label="Project" optionText={projectOptionText} />
	</ReferenceInput>,

	<ReferenceInput
		key="category"
		source="category_id"
		reference="transaction_category"
	>
		<SelectInput label="Category" optionText={categoryOptionText} />
	</ReferenceInput>,
];

export const TransactionList = () => {
	return (
		<List
			exporter={transactionExporter}
			filters={transactionFilters}
			sort={{ field: "created_at", order: "DESC" }}
		>
			<TransactionDataTable />
		</List>
	);
};

import { transactionExporter } from "#/lib/exporter/transactionExporter";
import { categoryOptionText } from "#/lib/form/categoryOptionText";
import { projectOptionText } from "#/lib/form/projectOptionText";
import { tagOptionText } from "#/lib/form/tagOptionText";
import { TransactionDataTable } from "#/routes/transaction/TransactionDataTable";
import {
	DateInput,
	List,
	ReferenceInput,
	SelectInput,
} from "@/components/admin";

const transactionFilters = [
	<DateInput
		key="transaction_at@gte"
		source="transaction_at@gte"
		label="From"
	/>,
	<DateInput key="transaction_at@lte" source="transaction_at@lte" label="To" />,
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

	<ReferenceInput key="tag" source="tag_id" reference="transaction_tag">
		<SelectInput label="Content" optionText={tagOptionText} />
	</ReferenceInput>,
	// TODO rethink of this
	// <SelectInput
	// 	key="amountFilter"
	// 	source="amountFilter"
	// 	label="Amount Type"
	// 	choices={[
	// 		{ id: "positive", name: "Income" },
	// 		{ id: "negative", name: "Expense" },
	// 	]}
	// />,
];

export const TransactionList = () => {
	return (
		<List
			exporter={transactionExporter}
			filters={transactionFilters}
			sort={{ field: "transaction_at", order: "DESC" }}
		>
			<TransactionDataTable />
		</List>
	);
};

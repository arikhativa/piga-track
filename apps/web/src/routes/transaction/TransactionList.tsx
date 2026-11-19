import {
	CategorySelectInput,
	ChildCategorySelectInput,
} from "#/components/form/CategorySelectInput";
import { DEFAULT_PER_PAGE } from "#/lib/constant";
import { projectOptionText } from "#/lib/form/projectOptionText";

import { TransactionDataTable } from "#/routes/transaction/TransactionDataTable";

import {
	DateInput,
	List,
	NumberInput,
	ReferenceInput,
	SearchInput,
	SelectInput,
} from "@/components/admin";

const transactionFilters = [
	<SearchInput
		key="description"
		source="description@ilike"
		placeholder="Search description..."
		alwaysOn
	/>,

	<DateInput
		key="transaction_at@gte"
		source="transaction_at@gte"
		label="From"
	/>,
	<DateInput key="transaction_at@lte" source="transaction_at@lte" label="To" />,

	<SelectInput
		key="amountType"
		source="amountType"
		label="Amount type"
		choices={[
			{ id: "negative", name: "Negative" },
			{ id: "positive", name: "Positive" },
		]}
	/>,

	<ReferenceInput
		key="project"
		source="project_id"
		reference="transaction_project"
	>
		<SelectInput label="Project" optionText={projectOptionText} />
	</ReferenceInput>,

	<CategorySelectInput key="category" source="category_id" label="Category" />,

	<ChildCategorySelectInput
		key="sub_category"
		source="sub_category_id"
		label="Subcategory"
	/>,

	<NumberInput
		key="amount_nis@gte"
		source="amount_nis@gte"
		label="Minimum amount"
	/>,
	<NumberInput
		key="amount_nis@lte"
		source="amount_nis@lte"
		label="Maximum amount"
	/>,
];

export const TransactionList = () => {
	return (
		<List
			title={""}
			filters={transactionFilters}
			sort={{ field: "transaction_at", order: "DESC" }}
			perPage={DEFAULT_PER_PAGE}
		>
			<TransactionDataTable />
		</List>
	);
};

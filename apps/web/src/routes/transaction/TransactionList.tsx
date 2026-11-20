import { useListContext, useStore } from "ra-core";
import { useEffect, useRef } from "react";
import {
	CategorySelectInput,
	ChildCategorySelectInput,
} from "#/components/form/CategorySelectInput";
import { useIsMobile } from "#/hooks/use-mobile";
import { DEFAULT_PER_PAGE } from "#/lib/constant";
import { projectOptionText } from "#/lib/form/projectOptionText";

import { TransactionDataTable } from "#/routes/transaction/TransactionDataTable";

import {
	ColumnsButton,
	CreateButton,
	DateInput,
	FilterButton,
	List,
	ReferenceInput,
	SearchInput,
	SelectInput,
} from "@/components/admin";

const transactionFilters = [
	<SearchInput
		key="description"
		source="description@ilike"
		placeholder="Smart search"
		className="max-sm:w-full max-sm:[.filter-field:has(&)]:w-full"
		alwaysOn
	></SearchInput>,

	<SelectInput
		key="amountType"
		source="amountType"
		label="Income / Expense"
		choices={[
			{ id: "negative", name: "Expense" },
			{ id: "positive", name: "Income" },
		]}
	/>,

	<DateInput
		key="transaction_at@gte"
		source="transaction_at@gte"
		label="From"
	/>,

	<DateInput key="transaction_at@lte" source="transaction_at@lte" label="To" />,

	<CategorySelectInput key="category" source="category_id" label="Category" />,

	<ChildCategorySelectInput
		key="sub_category"
		source="sub_category_id"
		label="Sub category"
	/>,

	<ReferenceInput
		key="project"
		source="project_id"
		reference="transaction_project"
	>
		<SelectInput label="Project" optionText={projectOptionText} />
	</ReferenceInput>,
];

const defaultHiddenColumns = ["project_id"];

const TransactionListTable = () => {
	const { filterValues } = useListContext();
	const isMobile = useIsMobile();
	const [hiddenColumns, setHiddenColumns] = useStore<string[]>(
		"transaction.datatable",
		defaultHiddenColumns,
	);
	const automaticallyHidden = useRef<string[]>([]);

	const hideCategory =
		filterValues.category_id != null && filterValues.category_id !== "";
	const hideSubcategory =
		filterValues.sub_category_id != null && filterValues.sub_category_id !== "";
	const hideProject =
		filterValues.project_id != null && filterValues.project_id !== "";
	const hideOwner =
		isMobile ||
		(filterValues.profile_id != null && filterValues.profile_id !== "");

	useEffect(() => {
		const automaticColumns = [
			...(hideCategory ? ["category_id"] : []),
			...(hideSubcategory ? ["sub_category_id"] : []),
			...(hideProject ? ["project_id"] : []),
			...(hideOwner ? ["profile_id"] : []),
		];

		const nextColumns = hiddenColumns.filter(
			(source) => !automaticallyHidden.current.includes(source),
		);

		automaticallyHidden.current = automaticColumns.filter(
			(source) => !nextColumns.includes(source),
		);

		for (const source of automaticColumns) {
			if (!nextColumns.includes(source)) nextColumns.push(source);
		}
		if (
			nextColumns.length !== hiddenColumns.length ||
			nextColumns.some((source, index) => source !== hiddenColumns[index])
		) {
			setHiddenColumns(nextColumns);
		}
	}, [
		hideCategory,
		hideSubcategory,
		hideProject,
		hideOwner,
		hiddenColumns,
		setHiddenColumns,
	]);

	useEffect(
		() => () => {
			setHiddenColumns((columns) =>
				columns.filter(
					(source) => !automaticallyHidden.current.includes(source),
				),
			);
		},
		[setHiddenColumns],
	);

	return <TransactionDataTable hiddenColumns={defaultHiddenColumns} />;
};

export const TransactionList = () => {
	return (
		<List
			actions={
				<div className="flex w-full justify-between">
					<ColumnsButton />
					<div className="space-x-2">
						<FilterButton />
						<CreateButton />
					</div>
				</div>
			}
			title={""}
			filters={transactionFilters}
			sort={{ field: "transaction_at", order: "DESC" }}
			perPage={DEFAULT_PER_PAGE}
		>
			<TransactionListTable />
		</List>
	);
};

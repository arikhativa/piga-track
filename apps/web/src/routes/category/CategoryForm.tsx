import type { TransactionCategory } from "@piga/db/types";
import { useRecordContext } from "ra-core";
import { useWatch } from "react-hook-form";
import { categoryOptionText } from "#/lib/form/categoryOptionText";
import {
	BooleanInput,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
} from "@/components/admin";

function CategoryTypeInputs() {
	const parentId = useWatch({ name: "parent_id" });
	if (parentId != null && parentId !== "") return null;

	return (
		<>
			<BooleanInput source="is_income" />
			<BooleanInput source="is_expense" />
		</>
	);
}

export function CategoryForm() {
	const record = useRecordContext<TransactionCategory>();

	return (
		<SimpleForm>
			<TextInput autoFocus source="value" label="Name" />
			<ReferenceInput
				source="parent_id"
				reference="transaction_category"
				sort={{ field: "value", order: "ASC" }}
			>
				<SelectInput
					optionText={categoryOptionText}
					label="Parent category"
					emptyText="No parent (top-level category)"
					parse={(value) => (value === "" ? null : value)}
					validate={(value) =>
						value != null && value === record?.id
							? "A category cannot be its own parent."
							: undefined
					}
				/>
			</ReferenceInput>
			<CategoryTypeInputs />
		</SimpleForm>
	);
}

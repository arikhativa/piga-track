import { required } from "ra-core";
import {
	CategorySelectInput,
	ChildCategorySelectInput,
} from "#/components/form/CategorySelectInput";
import { currencyOptionText } from "#/lib/form/currencyOptionText";
import { projectOptionText } from "#/lib/form/projectOptionText";
import { ReferenceInput, SelectInput, SimpleForm } from "@/components/admin";

export function DefaultsForm() {
	return (
		<SimpleForm>
			<ReferenceInput source="default_currency_id" reference="currency">
				<SelectInput
					label="Default currency"
					optionText={currencyOptionText}
					validate={required()}
				/>
			</ReferenceInput>

			<ReferenceInput
				source="default_transaction_type_id"
				reference="transaction_type"
			>
				<SelectInput label="Default transaction_type" validate={required()} />
			</ReferenceInput>

			<CategorySelectInput
				source="default_category_id"
				label="Default Category"
			/>

			<ChildCategorySelectInput
				source="default_sub_category_id"
				parentSource="default_category_id"
				label="Default Sub Category"
			/>

			<ReferenceInput
				source="default_project_id"
				reference="transaction_project"
			>
				<SelectInput label="Default Project" optionText={projectOptionText} />
			</ReferenceInput>
		</SimpleForm>
	);
}

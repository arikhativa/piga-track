import { required } from "ra-core";
import { categoryOptionText } from "#/lib/form/categoryOptionText";
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

			<ReferenceInput
				source="default_category_id"
				reference="transaction_category"
			>
				<SelectInput label="Default Category" optionText={categoryOptionText} />
			</ReferenceInput>

			<ReferenceInput
				source="default_project_id"
				reference="transaction_project"
			>
				<SelectInput label="Default Project" optionText={projectOptionText} />
			</ReferenceInput>
		</SimpleForm>
	);
}

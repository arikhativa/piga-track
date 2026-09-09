import { required } from "ra-core";
import { NIS_ID } from "#/db/schema";
import { currencyOptionText } from "#/lib/form/currencyOptionText";
import {
	NumberInput,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
} from "@/components/admin";

export function ImportProfileForm() {
	return (
		<SimpleForm>
			<TextInput source="name" />

			<ReferenceInput source="currency_id" reference="currency">
				<SelectInput
					defaultValue={NIS_ID}
					optionText={currencyOptionText}
					validate={required()}
				/>
			</ReferenceInput>

			<NumberInput source="start_row" />

			<TextInput source="date_column" />
			<TextInput source="positive_amount_column" />
			<TextInput source="negative_amount_column" />

			<TextInput source="tag_column" />
			<TextInput source="description_column" />
		</SimpleForm>
	);
}

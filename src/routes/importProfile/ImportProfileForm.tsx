import { required } from "ra-core";
import { NIS_ID } from "#/db/schema";
import { currencyOptionText } from "#/lib/form/currencyOptionText";
import { drizzleTextArray } from "#/lib/format/drizzleTextArray";
import {
	BooleanInput,
	NumberInput,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextArrayInput,
	TextInput,
} from "@/components/admin";

export function ImportProfileForm() {
	return (
		<SimpleForm
			defaultValues={{
				positive_amount_sign: true,
				negative_amount_sign: true,
			}}
		>
			<TextInput source="name" validate={required()} />

			<ReferenceInput source="currency_id" reference="currency">
				<SelectInput
					defaultValue={NIS_ID}
					optionText={currencyOptionText}
					validate={required()}
				/>
			</ReferenceInput>

			<NumberInput source="start_row" />

			<TextInput source="date_column" />

			<div className="py-4 space-y-4">
				<TextInput
					source="positive_amount_column"
					label={"Amount received column"}
				/>
				<BooleanInput
					source="positive_amount_sign"
					label={"Is a positive number?"}
				/>
			</div>

			<div className="py-4 space-y-4">
				<TextInput
					source="negative_amount_column"
					label={"Amount spent column"}
				/>
				<BooleanInput
					source="negative_amount_sign"
					label={"Is a positive number?"}
				/>
			</div>

			<TextArrayInput
				format={drizzleTextArray}
				source="description_column_list"
			/>
		</SimpleForm>
	);
}

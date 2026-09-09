import { required } from "ra-core";
import { importProfileOptionText } from "#/lib/form/importProfileOptionText";
import {
	Create,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
} from "@/components/admin";

export function ImportBatchCreate() {
	return (
		<Create>
			<SimpleForm>
				<TextInput source="batch_name" />

				<ReferenceInput source="import_profile_id" reference="import_profile">
					<SelectInput
						optionText={importProfileOptionText}
						validate={required()}
					/>
				</ReferenceInput>
			</SimpleForm>
		</Create>
	);
}

import {
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
} from "@/components/admin";

export function ClassificationForm() {
	return (
		<SimpleForm>
			<TextInput source="text_to_find" />

			<ReferenceInput source="category_id" reference="transaction_category">
				<SelectInput label="Category" optionText="value" />
			</ReferenceInput>

			<ReferenceInput source="tag_id" reference="transaction_tag">
				<SelectInput label="Content" optionText="value" />
			</ReferenceInput>
		</SimpleForm>
	);
}

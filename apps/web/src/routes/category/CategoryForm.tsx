import { BooleanInput, SimpleForm, TextInput } from "@/components/admin";

export function CategoryForm() {
	return (
		<SimpleForm>
			<TextInput autoFocus source="value" label="Name" />
			<BooleanInput source="is_income" />
			<BooleanInput source="is_expense" />
		</SimpleForm>
	);
}

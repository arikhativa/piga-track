import { SimpleForm, TextInput } from "@/components/admin";

export function CategoryForm() {
	return (
		<SimpleForm>
			<TextInput source="value" label="Name" />
		</SimpleForm>
	);
}

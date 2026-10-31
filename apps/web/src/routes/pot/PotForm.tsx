import { SimpleForm, TextInput } from "@/components/admin";

export function PotForm() {
	return (
		<SimpleForm>
			<TextInput autoFocus source="name" />
		</SimpleForm>
	);
}

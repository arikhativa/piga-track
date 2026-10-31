import { SimpleForm, TextInput } from "@/components/admin";

export function TransactionTagForm() {
	return (
		<SimpleForm>
			<TextInput autoFocus source="value" />
		</SimpleForm>
	);
}

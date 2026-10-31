import { SimpleForm, TextInput } from "@/components/admin";

export function CurrencyForm() {
	return (
		<SimpleForm>
			<TextInput autoFocus source="name" />
			<TextInput source="iso_code" />
			<TextInput source="symbol" />
		</SimpleForm>
	);
}

import { SimpleForm, TextInput } from "@/components/admin";

export function CurrencyForm() {
	return (
		<SimpleForm>
			<TextInput source="iso_numeric_code" />
			<TextInput source="symbol" />
		</SimpleForm>
	);
}

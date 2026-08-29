import { NumberInput, SimpleForm, TextInput } from "@/components/admin";

export function PotForm() {
	return (
		<SimpleForm>
			<TextInput source="name" />
			<NumberInput source="base" />
		</SimpleForm>
	);
}

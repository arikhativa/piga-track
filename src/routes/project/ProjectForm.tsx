import { DateInput, SimpleForm, TextInput } from "@/components/admin";

export function ProjectForm() {
	return (
		<SimpleForm>
			<TextInput source="value" />
			<DateInput
				source="transaction_at"
				defaultValue={new Date().toISOString()}
			/>
		</SimpleForm>
	);
}

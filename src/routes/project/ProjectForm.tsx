import { DateInput, SimpleForm, TextInput } from "@/components/admin";

export function ProjectForm() {
	return (
		<SimpleForm>
			<TextInput source="value" />
			<DateInput source="created_at" defaultValue={new Date().toISOString()} />
		</SimpleForm>
	);
}

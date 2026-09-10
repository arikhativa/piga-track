import { Edit, SimpleForm, TextInput } from "@/components/admin";

export function ImportBatchEdit() {
	return (
		<Edit>
			<SimpleForm>
				<TextInput source="batch_name" />
			</SimpleForm>
		</Edit>
	);
}

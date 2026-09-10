import { ImportBatchTitle } from "#/routes/importBatch/ImportBatchTitle";
import { Edit, SimpleForm, TextInput } from "@/components/admin";

export function ImportBatchEdit() {
	return (
		<Edit title={<ImportBatchTitle />}>
			<SimpleForm>
				<TextInput source="batch_name" />
			</SimpleForm>
		</Edit>
	);
}

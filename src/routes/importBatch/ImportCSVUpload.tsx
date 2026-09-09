import {
	FileField,
	FileInput,
	SimpleForm,
	TextInput,
} from "@/components/admin";

export function ImportCSVUpload() {
	return (
		<SimpleForm>
			<TextInput source="batch_name" label="Batch name" isRequired />

			<FileInput
				source="file"
				label="CSV file"
				accept={{
					"text/csv": [".csv"],
				}}
			>
				<FileField source="src" title="title" />
			</FileInput>
		</SimpleForm>
	);
}

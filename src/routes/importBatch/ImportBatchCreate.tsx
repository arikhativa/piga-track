import { CreateBase, required } from "ra-core";
import { Spinner } from "#/components/admin/spinner";
import { useImportProfiles } from "#/hooks/use-import-profiles";
import { importProfileOptionText } from "#/lib/form/importProfileOptionText";
import { createImportBatch } from "#/lib/importer/createImportBatch";
import { parseImportRow } from "#/lib/importer/parseImportRow";
import { readSpreadsheet } from "#/lib/importer/readSpreadsheet";
import {
	CreateView,
	FileField,
	FileInput,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
} from "@/components/admin";

export function ImportBatchCreate() {
	const { data: profileList, isPending, isSuccess } = useImportProfiles();

	if (isPending || !isSuccess || !profileList || !profileList.length) {
		return <Spinner />;
	}

	return (
		<CreateBase>
			<CreateView title="Create Import Batch">
				<SimpleForm
					onSubmit={async (data: any) => {
						try {
							const file = data.file?.rawFile;

							if (!file) {
								throw new Error("Please select a file.");
							}

							const profile = profileList.find(
								(profile) => profile.id === Number(data.import_profile_id),
							);

							if (!profile) {
								throw new Error("Import profile not found.");
							}

							const rows = await readSpreadsheet(file);
							const parsed = parseImportRow(rows, profile);

							await createImportBatch({
								batch_name: data.batch_name,
								import_profile_id: Number(data.import_profile_id),
								rows: parsed,
							});
						} catch (error) {
							console.error("Failed to create import batch:", error);
							throw error;
						}
					}}
				>
					<TextInput source="batch_name" />

					<ReferenceInput source="import_profile_id" reference="import_profile">
						<SelectInput
							optionText={importProfileOptionText}
							validate={required()}
						/>
					</ReferenceInput>

					<FileInput
						validate={required()}
						source="file"
						accept={{
							"text/csv": [".csv"],
							"text/xls": [".xls"],
						}}
					>
						<FileField source="src" title="title" />
					</FileInput>
				</SimpleForm>
			</CreateView>
		</CreateBase>
	);
}

import { required } from "ra-core";
import { Spinner } from "#/components/admin/spinner";
import { useImportProfiles } from "#/hooks/use-import-profiles";
import { importProfileOptionText } from "#/lib/form/importProfileOptionText";
import { parseImportRow } from "#/lib/importer/parseImportRow";
import { readSpreadsheet } from "#/lib/importer/readSpreadsheet";
import {
	Create,
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
		<Create
			transform={async (data) => {
				const file = data.file?.rawFile;

				if (!file) {
					throw new Error("Please select a file.");
				}

				const importProfile = profileList.find(
					(profile) => profile.id === Number(data.import_profile_id),
				);

				if (!importProfile) {
					throw new Error("Import profile not found.");
				}

				const spreadsheet = await readSpreadsheet(file);
				const rows = parseImportRow(spreadsheet, importProfile);

				return {
					batch_name: data.batch_name,
					import_profile_id: Number(data.import_profile_id),
					rows,
				};
			}}
		>
			<SimpleForm>
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
		</Create>
	);
}

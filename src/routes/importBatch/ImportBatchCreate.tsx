import { required } from "ra-core";
import type { ImportBatch, ImportProfile } from "#/db/schema";
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

// TODO:
// create a edge func on supabase
// there should not be a regular create for this obj
export function ImportBatchCreate() {
	const { data: profileList } = useImportProfiles();

	return (
		<Create
			transform={async (data) => {
				const file = data.file?.rawFile;

				if (!file) {
					// TODO
					return data;
				}

				const profile: ImportProfile | undefined = profileList?.find(
					(e) => e.id === Number(data.import_profile_id),
				);

				if (!profile) {
					// TODO
					return data;
				}

				const rows = await readSpreadsheet(file);
				const parsed = parseImportRow(rows, profile);

				console.log("parsed", parsed);

				return {
					...data,
					file: undefined,
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

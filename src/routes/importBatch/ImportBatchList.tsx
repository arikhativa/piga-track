import { capitalize } from "lodash";
import { Badge } from "#/components/ui/badge";
import type { ImportBatch, ImportProfile } from "#/db/schema";
import { importProfileOptionText } from "#/lib/form/importProfileOptionText";
import { getBatchStatusVariant } from "#/lib/variant/getBatchStateVariant";
import { DataTable, List, ReferenceField } from "@/components/admin";

export const ImportBatchList = () => (
	<List>
		<DataTable>
			<DataTable.Col source="batch_name" />

			<DataTable.Col source="import_profile_id">
				<ReferenceField
					source="import_profile_id"
					reference="import_profile"
					render={({ referenceRecord }) =>
						importProfileOptionText(referenceRecord as ImportProfile)
					}
				></ReferenceField>
			</DataTable.Col>

			<DataTable.Col
				source="status"
				render={(record: ImportBatch) => {
					return (
						<Badge variant={getBatchStatusVariant(record.status)}>
							{capitalize(record.status)}
						</Badge>
					);
				}}
			/>
		</DataTable>
	</List>
);

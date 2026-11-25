import {
	FIBI_ID,
	type ImportBatch,
	type ImportProfile,
	type ImportRow,
	MAX_ID,
} from "@piga/db/schema";
import type { Identifier, RaRecord } from "ra-core";
import type { DataTableColumnProps } from "#/components/admin";
import { DataTable, ReferenceField } from "#/components/admin";
import { FibiBadge } from "#/components/transaction-type-badges/FibiBadge";
import { MaxBadge } from "#/components/transaction-type-badges/MaxBadge";

// TODO: the Ids should not be dynamic
export function ImportRowTransactionTypeCol<
	RecordType extends RaRecord<Identifier> & ImportRow,
>(props: DataTableColumnProps<RecordType>) {
	return (
		<DataTable.Col
			{...props}
			label="Provider"
			render={(record: ImportRow) => {
				if (record.max_sync_table_id) {
					return <MaxBadge />;
				}
				if (record.import_batch_id == null) {
					return null;
				}
				return (
					<ReferenceField
						source="import_batch_id"
						reference="import_batch"
						link={false}
					>
						<ReferenceField<ImportBatch, ImportProfile>
							source="import_profile_id"
							reference="import_profile"
							link={false}
							render={({ referenceRecord }) => {
								if (referenceRecord?.transaction_type_id === MAX_ID) {
									return <MaxBadge />;
								}
								if (referenceRecord?.transaction_type_id === FIBI_ID) {
									return <FibiBadge />;
								}
								return null;
							}}
						></ReferenceField>
					</ReferenceField>
				);
			}}
		/>
	);
}

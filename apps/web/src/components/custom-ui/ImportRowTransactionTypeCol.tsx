import {
	type ImportBatch,
	type ImportProfile,
	type ImportRow,
	MAX_ID,
} from "@piga/db/schema";
import type { Identifier, RaRecord } from "ra-core";
import type { DataTableColumnProps } from "#/components/admin";
import { DataTable, ReferenceField } from "#/components/admin";
import { TransactionTypeBadge } from "#/components/transaction-type-badges/TransactionTypeBadge";

export function ImportRowTransactionTypeCol<
	RecordType extends RaRecord<Identifier> & ImportRow,
>(props: DataTableColumnProps<RecordType>) {
	return (
		<DataTable.Col
			{...props}
			label="Provider"
			render={(record: ImportRow) => {
				if (record.max_sync_table_id) {
					return <TransactionTypeBadge typeId={MAX_ID} />;
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
							render={({ referenceRecord }) => (
								<TransactionTypeBadge
									typeId={referenceRecord?.transaction_type_id}
								/>
							)}
						></ReferenceField>
					</ReferenceField>
				);
			}}
		/>
	);
}

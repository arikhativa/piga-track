import type { ImportBatch, ImportProfile, ImportRow } from "@piga/db/schema";
import type { Identifier, RaRecord } from "ra-core";
import type { DataTableColumnProps } from "#/components/admin";
import { DataTable, ReferenceField } from "#/components/admin";
import { Badge } from "#/components/ui/badge";

function MaxBadge() {
	return (
		<Badge
			className={
				"bg-[#69ecd5] text-[#182957] dark:bg-[#182957] dark:text-[#69ecd5] font-extrabold p-3 "
			}
		>
			Max
		</Badge>
	);
}

function FibiBadge() {
	return (
		<Badge className={"bg-[#142050] text-[#f7ca2f]  font-extrabold p-3 "}>
			הבינלאומי
		</Badge>
	);
}

// TODO: the Ids should not be dynamic
export function DataTableTransactionTypeCol<
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
								if (referenceRecord?.transaction_type_id === 6) {
									return <MaxBadge />;
								}
								if (referenceRecord?.transaction_type_id === 4) {
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

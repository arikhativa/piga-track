import type { ImportRow } from "@piga/db/schema";
import type { Identifier, RaRecord } from "ra-core";
import type { DataTableColumnProps } from "#/components/admin";
import { DataTable } from "#/components/admin";
import { Badge } from "#/components/ui/badge";

export function DataTableTransactionTypeCol<
	RecordType extends RaRecord<Identifier> & ImportRow,
>(props: DataTableColumnProps<RecordType>) {
	return (
		<DataTable.Col
			{...props}
			render={(record: ImportRow) => {
				if (record.max_sync_table_id) {
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
				return null;
			}}
		/>
	);
}

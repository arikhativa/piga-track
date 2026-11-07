import type { ImportRow } from "@piga/db/types";
import { DataTableSignCol } from "#/components/custom-ui/DataTableSignCol";
import { DEFAULT_PER_PAGE } from "#/lib/constant";
import { formatCurrency } from "#/lib/format/formatNIS";
import { DataTable, DateField, List } from "@/components/admin";
import { ImportRowCategory } from "../importBatch/ImportRowCategory";
import { ImportRowProject } from "../importBatch/ImportRowProject";
import { ImportRowTag } from "../importBatch/ImportRowTag";

export const ImportRowSyncList = () => (
	<List
		perPage={DEFAULT_PER_PAGE}
		filter={{ "max_sync_table_id@not.is": null }}
	>
		<DataTable>
			<DataTableSignCol />

			<DataTable.Col
				source="amount"
				render={(record) => {
					return <>{formatCurrency(Math.abs(Number(record.amount)))}</>;
				}}
			/>

			<DataTable.Col label="Date">
				<DateField source="date" />
			</DataTable.Col>

			<DataTable.Col source="description" />

			<DataTable.Col
				label="Content"
				render={(record: ImportRow) => {
					return <ImportRowTag record={record} />;
				}}
			></DataTable.Col>

			<DataTable.Col
				label="Category"
				render={(record: ImportRow) => {
					return <ImportRowCategory record={record} />;
				}}
			></DataTable.Col>

			<DataTable.Col
				label="Project"
				render={(record: ImportRow) => {
					return <ImportRowProject record={record} />;
				}}
			></DataTable.Col>
		</DataTable>
	</List>
);

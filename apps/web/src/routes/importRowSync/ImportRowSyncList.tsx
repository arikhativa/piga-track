import { DEFAULT_PER_PAGE } from "#/lib/constant";
import { DataTable, List } from "@/components/admin";

export const ImportRowSyncList = () => (
	<List
		perPage={DEFAULT_PER_PAGE}
		filter={{ "max_sync_table_id@not.is": null }}
	>
		<DataTable>
			<DataTable.Col source="amount" />
			<DataTable.Col source="description" />
			<DataTable.Col source="date" />
		</DataTable>
	</List>
);

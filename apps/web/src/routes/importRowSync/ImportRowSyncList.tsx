import { DEFAULT_PER_PAGE } from "#/lib/constant";
import { List } from "@/components/admin";
import { ImportRowDataTable } from "../importBatch/ImportRowDataTable";

export const ImportRowSyncList = () => (
	<List
		perPage={DEFAULT_PER_PAGE}
		filter={{
			"max_sync_table_id@not.is": null,
			"or@": `(status.eq.pending,updated_at.gte.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()})`,
		}}
	>
		<ImportRowDataTable />
	</List>
);

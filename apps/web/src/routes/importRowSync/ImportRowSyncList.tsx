import { List } from "@/components/admin";
import { ImportRowDataTable } from "../importBatch/ImportRowDataTable";

export const ImportRowSyncList = () => (
	<List
		perPage={1000}
		sort={{ field: "date.desc,amount_nis", order: "DESC" }}
		filter={{
			"max_sync_table_id@not.is": null,
			"or@": `(status.eq.pending,touched_by_user.is.null,touched_by_user.gte.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()})`,
		}}
	>
		<ImportRowDataTable />
	</List>
);

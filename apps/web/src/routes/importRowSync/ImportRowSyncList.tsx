import { IMPORT_ROW_VISIBILITY_WINDOW_MS } from "@piga/contracts/import-row-action";
import { DEFAULT_PER_PAGE } from "#/lib/constant";
import { ExportButton, List } from "@/components/admin";
import { ImportRowDataTable } from "../importBatch/ImportRowDataTable";
import { RunAutoSyncButton } from "./RunAutoSyncButton";

export const ImportRowSyncList = () => (
	<List
		actions={
			<div className="flex items-center gap-2">
				<RunAutoSyncButton />
				<ExportButton />
			</div>
		}
		perPage={DEFAULT_PER_PAGE}
		sort={{ field: "date.desc,id", order: "DESC" }}
		filter={{
			"max_sync_table_id@not.is": null,
			"or@": `(status.eq.pending,touched_by_user.is.null,touched_by_user.gte.${new Date(Date.now() - IMPORT_ROW_VISIBILITY_WINDOW_MS).toISOString()})`,
		}}
	>
		<ImportRowDataTable allowHideRows />
	</List>
);

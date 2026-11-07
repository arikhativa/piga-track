import { importRowSyncListParams } from "#/hooks/use-import-row-sync";
import { ExportButton, List } from "@/components/admin";
import { ImportRowDataTable } from "../importBatch/ImportRowDataTable";
import { RunAutoSyncButton } from "./RunAutoSyncButton";

export const ImportRowSyncList = () => (
	<List
		cardOnMobile
		actions={
			<div className="flex items-center gap-2">
				<RunAutoSyncButton />
				<ExportButton />
			</div>
		}
		perPage={importRowSyncListParams.pagination.perPage}
		sort={importRowSyncListParams.sort}
		filter={importRowSyncListParams.filter}
	>
		<ImportRowDataTable allowHideRows />
	</List>
);

import { importRowSyncListParams } from "#/hooks/use-import-row-sync";
import { useIsMobile } from "#/hooks/use-mobile";
import { List } from "@/components/admin";
import { ImportRowDataTable } from "../importBatch/ImportRowDataTable";
import { RunAutoSyncButton } from "./RunAutoSyncButton";

export const ImportRowSyncList = () => {
	const isMobile = useIsMobile();

	return (
		<List
			cardOnMobile
			pagination={!isMobile}
			title={""}
			actions={
				<div className="flex items-center justify-center md:justify-end w-full gap-2">
					<RunAutoSyncButton />
				</div>
			}
			perPage={importRowSyncListParams.pagination.perPage}
			sort={importRowSyncListParams.sort}
			filter={importRowSyncListParams.filter}
		>
			<ImportRowDataTable allowHideRows />
		</List>
	);
};

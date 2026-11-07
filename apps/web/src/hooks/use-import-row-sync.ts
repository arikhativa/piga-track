import { IMPORT_ROW_VISIBILITY_WINDOW_MS } from "@piga/contracts/import-row-action";
import type { ImportRow } from "@piga/db/schema";
import { useGetList } from "ra-core";
import { DEFAULT_PER_PAGE } from "#/lib/constant";

// Keep the cutoff identical across consumers so they share the same query cache.
// The visibility window is anchored to when this module loads.
export const importRowSyncListParams = {
	pagination: { page: 1, perPage: DEFAULT_PER_PAGE },
	sort: { field: "date.desc,id", order: "DESC" as const },
	filter: {
		"max_sync_table_id@not.is": null,
		"or@": `(status.eq.pending,touched_by_user.is.null,touched_by_user.gte.${new Date(Date.now() - IMPORT_ROW_VISIBILITY_WINDOW_MS).toISOString()})`,
	},
};

export function useImportRowSync() {
	const query = useGetList<ImportRow>("import_row", importRowSyncListParams);

	return { ...query };
}

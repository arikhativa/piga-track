import { useListContext, useNotify, useRefresh } from "ra-core";
import { SelectAllButton } from "#/components/admin";
import { Button } from "#/components/ui/button";
import type { Profile } from "#/db/schema";
import { importRowAction } from "#/lib/importer/importRowAction";

// TODO
// we need to disable the merge and the undo btns when the selected items are mixed statuses
// we need to show the bulk status on this page and allow changing it (after a big bulck merge we should updated the status to done)
// add the bulk action for category and content
// maybe also currency?
// change the color of the toast and also add a loader to the buttons

export function BulkActionButtons({ profileId }: { profileId: Profile["id"] }) {
	const notify = useNotify();
	const refresh = useRefresh();
	const { selectedIds, data } = useListContext();

	const selectedIdSet = new Set(selectedIds.map(Number));

	const selectedRows = Object.values(data ?? {}).filter((row) =>
		selectedIdSet.has(Number(row.id)),
	);

	const rowsMatchSelection = selectedRows.length === selectedIds.length;

	const statuses = rowsMatchSelection
		? selectedRows.map((row) => row.status)
		: [];

	const sameStatus =
		rowsMatchSelection && statuses.length > 0 && new Set(statuses).size === 1;

	const canMerge = sameStatus && statuses[0] === "pending";
	const canUndo = sameStatus && statuses[0] === "merged";

	const handleMerge = async () => {
		try {
			await importRowAction({
				import_row_ids: selectedIds as number[],
				profile_id: profileId,
				action: "merge",
			});

			notify(`${selectedIds.length} rows merged`, {
				type: "success",
			});

			refresh();
		} catch {
			notify("Failed to merge rows", {
				type: "error",
			});
		}
	};

	const handleUndo = async () => {
		try {
			await importRowAction({
				import_row_ids: selectedIds as number[],
				profile_id: profileId,
				action: "undo",
			});

			notify(`${selectedIds.length} rows undone`, {
				type: "success",
			});

			refresh();
		} catch {
			notify("Failed to undo rows", {
				type: "error",
			});
		}
	};

	return (
		<>
			<SelectAllButton />

			<Button
				type="button"
				variant="default"
				disabled={!canMerge}
				onClick={handleMerge}
			>
				Merge
			</Button>

			<Button
				type="button"
				variant="outline"
				disabled={!canUndo}
				onClick={handleUndo}
			>
				Undo
			</Button>
		</>
	);
}

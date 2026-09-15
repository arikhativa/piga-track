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
export function BulkActionButtons({ profileId }: { profileId: Profile["id"] }) {
	const { selectedIds } = useListContext();
	const notify = useNotify();
	const refresh = useRefresh();

	const handleMerge = async () => {
		if (!selectedIds.length) return;

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
		if (!selectedIds.length) return;

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
				disabled={!selectedIds.length}
				onClick={handleMerge}
			>
				Merge
			</Button>

			<Button
				type="button"
				variant="outline"
				disabled={!selectedIds.length}
				onClick={handleUndo}
			>
				Undo
			</Button>
		</>
	);
}

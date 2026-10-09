import { useNotify, useRecordContext, useRefresh } from "ra-core";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import type { ImportBatch } from "#/db/schema";
import { useProfile } from "#/hooks/use-profile";
import { importRowAction } from "#/lib/importer/importRowAction";

export function MergeAllPendingButton() {
	const { isSuccess, data: userProfile } = useProfile();
	const [isOpen, setIsOpen] = useState(false);
	const batch = useRecordContext<ImportBatch>();
	const notify = useNotify();
	const refresh = useRefresh();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleMerge = async () => {
		if (!batch || isSubmitting || !isSuccess) return;

		setIsSubmitting(true);

		try {
			await importRowAction({
				action: "mergeAllPending",
				import_row_ids: [],
				value: batch.id,
				profileId: userProfile.id,
			});

			notify("Pending rows merged successfully", {
				type: "success",
			});
			refresh();
		} catch (error) {
			console.error(error);
			notify("Failed to merge pending rows", {
				type: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger render={<Button disabled={!batch || isSubmitting} />}>
				Merge all pending
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Merge all pending rows?</AlertDialogTitle>
					<AlertDialogDescription>
						This will create transactions for all pending rows in this batch.
						This action may not be reversible.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={isSubmitting}
						onClick={() => {
							setIsOpen(false);
							void handleMerge();
						}}
					>
						Confirm merge
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

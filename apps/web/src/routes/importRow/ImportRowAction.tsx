import type { ImportRow, Profile } from "@piga/db/types";
import { cn } from "cn";
import { useNavigate, useRefresh } from "ra-core";
import { Button } from "#/components/ui/button";
import { importRowAction } from "#/lib/importer/importRowAction";

interface ImportRowActionProps {
	record: ImportRow;
	profileId: Profile["id"];
	isMobile: boolean;
	allowHideRows: boolean;
	isMerging: boolean;
	hidingRowId: number | null;
	setHidingRowId: (id: number | null) => void;
	mergeRow: (record: ImportRow) => Promise<void>;
}

export function ImportRowAction({
	record,
	profileId,
	isMobile,
	allowHideRows,
	isMerging,
	hidingRowId,
	setHidingRowId,
	mergeRow,
}: ImportRowActionProps) {
	const navigate = useNavigate();
	const refresh = useRefresh();

	const hideButton =
		allowHideRows && record.status !== "pending" ? (
			<Button
				type="button"
				size="sm"
				className={cn("border-border", isMobile && "flex-1")}
				variant={"secondary"}
				title="Hide"
				aria-label="Hide"
				disabled={hidingRowId !== null || isMerging}
				onClick={async () => {
					try {
						setHidingRowId(record.id);
						await importRowAction({
							action: "hide_rows",
							import_row_ids: [record.id],
						});
						refresh();
					} finally {
						setHidingRowId(null);
					}
				}}
			>
				Hide
			</Button>
		) : null;

	if (record.status === "duplicates" && record.duplicate_transaction_id) {
		return (
			<>
				<Button
					type="button"
					size="sm"
					className={cn("border-border", isMobile && "flex-1")}
					variant={"secondary"}
					title="Approve"
					onClick={() => mergeRow(record)}
				>
					Approve
				</Button>

				<Button
					type="button"
					size="sm"
					variant={"pink"}
					className={cn("border-border", isMobile && "flex-1")}
					title="Drop"
					onClick={async () => {
						await importRowAction({
							profileId: profileId,
							import_row_ids: [Number(record.id)],
							action: "set_status",
							value: "dropped",
						});
						refresh();
					}}
				>
					Drop
				</Button>

				<Button
					type="button"
					size="sm"
					variant={"purple"}
					className={cn("border-border", isMobile && "flex-1")}
					title="View Match"
					onClick={() =>
						navigate(`/transaction/${record.duplicate_transaction_id}`)
					}
				>
					View Match
				</Button>
				{hideButton}
			</>
		);
	}

	if (record.status === "pending") {
		return (
			<>
				<Button
					type="button"
					variant={"secondary"}
					size="sm"
					className={cn("border-border", isMobile && "flex-1")}
					title="Approve"
					aria-label="Approve"
					onClick={() => mergeRow(record)}
				>
					Approve
				</Button>

				<Button
					type="button"
					size="sm"
					variant={"pink"}
					className={cn("border-border", isMobile && "flex-1")}
					onClick={async () => {
						await importRowAction({
							profileId: profileId,
							import_row_ids: [Number(record.id)],
							action: "set_status",
							value: "dropped",
						});

						refresh();
					}}
				>
					Drop
				</Button>
			</>
		);
	}

	if (record.status === "merged" || record.status === "dropped") {
		return (
			<>
				<Button
					type="button"
					size="sm"
					variant={"secondary"}
					className={cn("border-border", isMobile && "flex-1")}
					title={isMerging ? "Saving merge…" : "Restore"}
					aria-label={isMerging ? "Saving merge" : "Restore"}
					disabled={isMerging}
					onClick={async () => {
						await importRowAction({
							profileId: profileId,
							import_row_ids: [Number(record.id)],
							action: "undo",
						});
						refresh();
					}}
				>
					Restore
				</Button>
				{hideButton}
			</>
		);
	}

	return hideButton;
}

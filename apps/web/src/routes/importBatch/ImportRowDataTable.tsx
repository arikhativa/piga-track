import type { ImportRow } from "@piga/db/types";
import { cn } from "cn";
import { capitalize } from "lodash";
import { Check, EyeOff, RotateCcw, SquareArrowUpRight, X } from "lucide-react";
import { useNavigate, useRefresh } from "ra-core";
import { useCallback, useState } from "react";
import { Spinner } from "#/components/admin/spinner";
import { DataTableAmount } from "#/components/custom-ui/DataTableAmount";
import { DataTableTransactionTypeCol } from "#/components/custom-ui/DataTableTransactionTypeCol";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";

import { useIsMobile } from "#/hooks/use-mobile";
import { useProfile } from "#/hooks/use-profile";

import { importRowAction } from "#/lib/importer/importRowAction";
import { getRowStateVariant } from "#/lib/variant/getRowStateVariant";
import { BulkActionButtons } from "#/routes/importBatch/BulkActionButtons";
import { ImportRowCategory } from "#/routes/importBatch/ImportRowCategory";
import { ImportRowProject } from "#/routes/importBatch/ImportRowProject";
import { ImportRowSubCategory } from "#/routes/importBatch/ImportRowSubCategory";
import { useOptimisticMerge } from "#/routes/importBatch/use-optimistic-merge";
import { ProfileFullName } from "#/routes/profile/ProfileFullName";
import { DataTable, DateField } from "@/components/admin";
import { ImportRowDescription } from "../importRow/ImportRowDescription";
import { ImportRowSyncEmpty } from "../importRowSync/ImportRowSyncEmpty";

export const ImportRowDataTable = ({
	allowHideRows = false,
}: {
	allowHideRows?: boolean;
}) => {
	// TODO: we might not need this
	const { isSuccess, data: userProfile } = useProfile();
	const isMobile = useIsMobile();

	const navigate = useNavigate();

	const refresh = useRefresh();
	const [hidingRowId, setHidingRowId] = useState<number | null>(null);
	const { displayedRows, optimisticMerges, hasOptimisticMerges, mergeRow } =
		useOptimisticMerge(userProfile?.id);

	const navToRealTrans = useCallback(
		(record: ImportRow) => {
			if (record.status === "merged" && record.transaction_id != null) {
				navigate(`/transaction/${record.transaction_id}`);
			}
		},
		[navigate],
	);

	const navCellClass = (record: ImportRow) => {
		return record.status === "merged" && record.transaction_id != null
			? "cursor-pointer"
			: "cursor-default";
	};

	if (!isSuccess) return <Spinner />;

	return (
		<DataTable<ImportRow>
			data={displayedRows}
			mobileCardHeaderDir="rtl"
			mobileCardHeaderClassName="grid grid-cols-[1fr_auto_1fr] items-center justify-items-start gap-x-2 border-b *:[direction:ltr] [&>:last-child]:justify-self-end"
			mobileCardFooterClassName="border-t !p-0 m-0"
			mobileCardContentClassName="py-4 grid grid-cols-2"
			empty={<ImportRowSyncEmpty />}
			bulkActionButtons={
				hasOptimisticMerges ? (
					false
				) : (
					<BulkActionButtons
						profileId={userProfile.id}
						allowHideRows={allowHideRows}
					/>
				)
			}
			rowClassName={(row) => {
				let className = "cursor-default";

				if (row.status === "dropped") {
					className += " text-muted-foreground/30";
				}
				if (isMobile) {
					className += " pb-0";
				}
				return className;
			}}
		>
			<DataTable.Col mobileCardHeader mobileHideLabel label="Owner">
				<ProfileFullName />
			</DataTable.Col>

			<DataTableAmount<ImportRow>
				mobileCardHeader
				mobileHideLabel
				cellClassName={navCellClass}
				onCellClick={navToRealTrans}
			/>

			<DataTable.Col
				mobileCardHeader
				mobileHideLabel
				cellClassName={navCellClass}
				onCellClick={navToRealTrans}
				label="Date"
			>
				<DateField source="date" />
			</DataTable.Col>

			<DataTableTransactionTypeCol mobileHideLabel />

			<DataTable.Col
				mobileHideLabel
				className={isMobile ? "flex justify-end" : undefined}
				source="status"
				render={(record: ImportRow) => (
					<Badge variant={getRowStateVariant(record.status)}>
						{capitalize(record.status)}
					</Badge>
				)}
			/>

			<DataTable.Col
				// TODO this should only be in rtl
				cellClassName={cn("text-right w-full md:w-auto", navCellClass)}
				onCellClick={navToRealTrans}
				mobileHideLabel
				className="col-span-2 md:col-span-1"
				source="description"
				render={
					isMobile
						? (record: ImportRow) => (
								<ImportRowDescription>
									{record.description}
								</ImportRowDescription>
							)
						: undefined
				}
			></DataTable.Col>

			<DataTable.Col
				label="Category"
				className="col-span-2 md:col-span-1"
				render={(record: ImportRow) => {
					return <ImportRowCategory record={record} />;
				}}
			></DataTable.Col>

			<DataTable.Col
				label="Sub Category"
				className="col-span-2 md:col-span-1"
				render={(record: ImportRow) => {
					return <ImportRowSubCategory record={record} />;
				}}
			></DataTable.Col>

			<DataTable.Col
				label="Project"
				className="col-span-2 md:col-span-1"
				render={(record: ImportRow) => {
					return <ImportRowProject record={record} />;
				}}
			></DataTable.Col>

			<DataTable.Col
				mobileCardFooter
				mobileHideLabel
				label="Action"
				className="py-0"
				headerClassName="md:flex md:items-center md:justify-center"
				cellClassName={
					isMobile
						? "flex w-full flex-row-reverse items-stretch gap-0 [&>button]:h-14 [&>button]:flex-1 [&>button]:rounded-none"
						: "flex items-center justify-center py-2 gap-4"
				}
				render={(record: ImportRow) => {
					const hideButton =
						allowHideRows && record.status !== "pending" ? (
							<Button
								type="button"
								size="icon"
								variant="ghost"
								className={cn(
									isMobile ? "flex-1" : undefined,
									"text-foreground",
								)}
								title="Hide row"
								aria-label="Hide row"
								disabled={hidingRowId !== null || !!optimisticMerges[record.id]}
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
								<EyeOff />
							</Button>
						) : null;

					if (
						record.status === "duplicates" &&
						record.duplicate_transaction_id
					) {
						return (
							<>
								<Button
									type="button"
									size="icon"
									variant="ghost"
									className={isMobile ? "flex-1" : undefined}
									title="Merge duplicate"
									onClick={() => mergeRow(record)}
								>
									<Check />
								</Button>

								{isMobile && <Separator orientation="vertical" />}

								<Button
									type="button"
									size="icon"
									variant="ghost"
									className={isMobile ? "flex-1" : undefined}
									title="Drop duplicate"
									onClick={async () => {
										await importRowAction({
											profileId: userProfile.id,
											import_row_ids: [Number(record.id)],
											action: "set_status",
											value: "dropped",
										});
										refresh();
									}}
								>
									<X />
								</Button>

								{isMobile && <Separator orientation="vertical" />}

								<Button
									type="button"
									size="icon"
									variant="ghost"
									className={isMobile ? "flex-1" : undefined}
									title="View linked transaction"
									onClick={() =>
										navigate(`/transaction/${record.duplicate_transaction_id}`)
									}
								>
									<SquareArrowUpRight />
								</Button>
								{isMobile && hideButton && <Separator orientation="vertical" />}
								{hideButton}
							</>
						);
					}

					if (record.status === "pending") {
						return (
							<>
								<Button
									type="button"
									variant={"ghost"}
									size="icon"
									className={isMobile ? "flex-1" : undefined}
									title="Merge row"
									aria-label="Merge row"
									onClick={() => mergeRow(record)}
								>
									<Check />
								</Button>

								{isMobile && <Separator orientation="vertical" />}

								<Button
									type="button"
									size="icon"
									variant={"ghost"}
									className={isMobile ? "flex-1" : undefined}
									onClick={async () => {
										await importRowAction({
											profileId: userProfile.id,
											import_row_ids: [Number(record.id)],
											action: "set_status",
											value: "dropped",
										});

										refresh();
									}}
								>
									<X />
								</Button>
							</>
						);
					}

					if (record.status === "merged" || record.status === "dropped") {
						return (
							<>
								<Button
									type="button"
									size="icon"
									className={cn("text-foreground", isMobile && "flex-1")}
									variant="ghost"
									title={optimisticMerges[record.id] ? "Saving merge…" : "Undo"}
									aria-label={
										optimisticMerges[record.id] ? "Saving merge" : "Undo"
									}
									disabled={!!optimisticMerges[record.id]}
									onClick={async () => {
										await importRowAction({
											profileId: userProfile.id,
											import_row_ids: [Number(record.id)],
											action: "undo",
										});
										refresh();
									}}
								>
									<RotateCcw />
								</Button>
								{isMobile && hideButton && <Separator orientation="vertical" />}
								{hideButton}
							</>
						);
					}

					return hideButton;
				}}
			/>
		</DataTable>
	);
};

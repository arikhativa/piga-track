import type { ImportRow } from "@piga/db/types";
import { cn } from "cn";
import { capitalize } from "lodash";
import { useNavigate } from "ra-core";
import { useCallback, useState } from "react";
import { Spinner } from "#/components/admin/spinner";
import { DataTableAmount } from "#/components/custom-ui/DataTableAmount";
import { DataTableTransactionTypeCol } from "#/components/custom-ui/DataTableTransactionTypeCol";
import { Badge } from "#/components/ui/badge";

import { useIsMobile } from "#/hooks/use-mobile";
import { useProfile } from "#/hooks/use-profile";

import { getRowStateVariant } from "#/lib/variant/getRowStateVariant";
import { BulkActionButtons } from "#/routes/importBatch/BulkActionButtons";
import { ImportRowCategory } from "#/routes/importBatch/ImportRowCategory";
import { ImportRowProject } from "#/routes/importBatch/ImportRowProject";
import { ImportRowSubCategory } from "#/routes/importBatch/ImportRowSubCategory";
import { useOptimisticMerge } from "#/routes/importBatch/use-optimistic-merge";
import { ImportRowAction } from "#/routes/importRow/ImportRowAction";
import { ImportRowStatusAlert } from "#/routes/importRow/ImportRowStatusAlert";
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
			mobileCardHeaderClassName="!pb-3 grid grid-cols-[1fr_auto_1fr] items-center justify-items-start gap-x-2 border-b *:[direction:ltr] [&>:last-child]:justify-self-end"
			mobileCardFooterClassName="border-t !pt-2"
			mobileCardContentClassName="py-3 grid grid-cols-2"
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
					className += " pb-3 pt-3";
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

			<DataTableTransactionTypeCol mobileHideLabel />

			<DataTable.Col
				className="flex flex-col items-start gap-.5"
				mobileCardHeader
				cellClassName={navCellClass}
				onCellClick={navToRealTrans}
				label={<span className="text-sm md:text-base">Date</span>}
			>
				<DateField locales="he-IL" source="date" />
			</DataTable.Col>

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

			{isMobile && (
				<DataTable.Col
					mobileHideLabel
					source="status"
					className="col-span-2"
					cellClassName="w-full"
					render={(record: ImportRow) => (
						<ImportRowStatusAlert status={record.status} />
					)}
				/>
			)}

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
				// className="py-0"
				headerClassName="md:flex md:items-center md:justify-center"
				cellClassName={
					isMobile
						? "flex w-full flex-row-reverse gap-2"
						: "flex items-center justify-center py-2 gap-4"
				}
				render={(record: ImportRow) => (
					<ImportRowAction
						record={record}
						profileId={userProfile.id}
						isMobile={isMobile}
						allowHideRows={allowHideRows}
						isMerging={!!optimisticMerges[record.id]}
						hidingRowId={hidingRowId}
						setHidingRowId={setHidingRowId}
						mergeRow={mergeRow}
					/>
				)}
			/>
		</DataTable>
	);
};

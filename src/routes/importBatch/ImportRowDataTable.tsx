import { capitalize } from "lodash";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useDataProvider, useNavigate, useRefresh } from "ra-core";
import { useCallback } from "react";
import { Spinner } from "#/components/admin/spinner";
import { DataTableSignCol } from "#/components/custom-ui/DataTableSignCol";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import type { ImportRow } from "#/db/schema";
import { useProfile } from "#/hooks/use-profile";
import { importRowAction } from "#/lib/importer/importRowAction";
import { getRowStateVariant } from "#/lib/variant/getRowStateVariant";
import { BulkActionButtons } from "#/routes/importBatch/BulkActionButtons";
import { ImportRowCategory } from "#/routes/importBatch/ImportRowCategory";
import { ImportRowProject } from "#/routes/importBatch/ImportRowProject";
import { ImportRowTag } from "#/routes/importBatch/ImportRowTag";
import { DataTable, DateField } from "@/components/admin";

export const ImportRowDataTable = () => {
	const { isSuccess, data: userProfile } = useProfile();
	const dataProvider = useDataProvider();

	const navigate = useNavigate();
	const refresh = useRefresh();

	const navToRealTrans = useCallback(
		(record: ImportRow) => {
			if (record.status === "merged") {
				navigate(`/transaction/${record.transaction_id}`);
			}
		},
		[navigate],
	);

	const navCellClass = (record: ImportRow) => {
		return record.status === "merged" ? "cursor-pointer" : "cursor-default";
	};

	if (!isSuccess) return <Spinner />;

	return (
		<DataTable<ImportRow>
			bulkActionButtons={<BulkActionButtons profileId={userProfile.id} />}
			rowClassName={(row) => {
				let ret = "cursor-default";

				if (row.status === "dropped") {
					ret += " text-muted-foreground/30";
				}
				return ret;
			}}
		>
			<DataTableSignCol
				cellClassName={navCellClass}
				onCellClick={navToRealTrans}
			/>

			<DataTable.Col
				cellClassName={navCellClass}
				onCellClick={navToRealTrans}
				source="amount"
				render={(record) => {
					return <>{Math.abs(Number(record.amount))}</>;
				}}
			/>

			<DataTable.Col
				cellClassName={navCellClass}
				onCellClick={navToRealTrans}
				label="Date"
			>
				<DateField source="date" />
			</DataTable.Col>

			<DataTable.Col
				cellClassName={navCellClass}
				onCellClick={navToRealTrans}
				source="description"
			/>

			<DataTable.Col
				label="Content"
				render={(record: ImportRow) => {
					return <ImportRowTag record={record} />;
				}}
			></DataTable.Col>

			<DataTable.Col
				label="Category"
				render={(record: ImportRow) => {
					return <ImportRowCategory record={record} />;
				}}
			></DataTable.Col>

			<DataTable.Col
				label="Project"
				render={(record: ImportRow) => {
					return <ImportRowProject record={record} />;
				}}
			></DataTable.Col>

			<DataTable.Col
				source="status"
				render={(record: ImportRow) => {
					if (record.duplicate_transaction_id) {
						return (
							<Badge
								variant={"destructive"}
							>{`Duplicates transaction ${record.duplicate_transaction_id}`}</Badge>
						);
					}
					return (
						<Badge variant={getRowStateVariant(record.status)}>
							{capitalize(record.status)}
						</Badge>
					);
				}}
			/>

			<DataTable.Col
				label="Action"
				headerClassName="flex items-center justify-center"
				cellClassName={"flex items-center justify-center py-2 gap-4"}
				render={(record: ImportRow) => {
					if (record.duplicate_transaction_id) {
						return;
					}
					if (record.status === "pending") {
						return (
							<>
								<Button
									type="button"
									size="icon"
									onClick={async () => {
										await importRowAction({
											profileId: userProfile.id,
											import_row_ids: [Number(record.id)],
											action: "merge",
										});

										refresh();
									}}
								>
									<Plus />
								</Button>

								<Button
									type="button"
									size="icon"
									variant="destructive"
									onClick={async () => {
										await dataProvider.update("import_row", {
											id: record.id,
											data: {
												status: "dropped",
											},
											previousData: record,
										});

										refresh();
									}}
								>
									<Minus />
								</Button>
							</>
						);
					}

					if (record.status === "merged" || record.status === "dropped") {
						return (
							<Button
								size="icon"
								className={"text-foreground"}
								variant="outline"
								onClick={async () => {
									if (record.status === "dropped") {
										await dataProvider.update("import_row", {
											id: record.id,
											data: {
												status: "pending",
											},
											previousData: record,
										});
									} else {
										await importRowAction({
											profileId: userProfile.id,
											import_row_ids: [Number(record.id)],
											action: "undo",
										});
									}
									refresh();
								}}
							>
								<RotateCcw />
							</Button>
						);
					}

					return null;
				}}
			/>
		</DataTable>
	);
};

import { capitalize } from "lodash";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useNavigate, useRefresh } from "ra-core";
import { Spinner } from "#/components/admin/spinner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import type { ImportRow } from "#/db/schema";
import { useProfile } from "#/hooks/use-profile";
import { importRowAction } from "#/lib/importer/importRowAction";
import { getRowStateVariant } from "#/lib/variant/getRowStateVariant";
import { DataTable, DateField, NumberField } from "@/components/admin";

export const ImportRowDataTable = () => {
	const { isSuccess, data: userProfile } = useProfile();
	const navigate = useNavigate();
	const refresh = useRefresh();

	if (!isSuccess) return <Spinner />;

	return (
		<DataTable<ImportRow>
			rowClassName={(row) => {
				if (row.status !== "merged") return "cursor-default";
			}}
			rowClick={(_id, _resource, record) => {
				if (record.status === "merged") {
					navigate(`/transaction/${record.transaction_id}`);
				}
				return false;
			}}
		>
			<DataTable.Col
				label="Type"
				render={(record) => (
					<Badge
						className="aspect-square rounded-full"
						variant={record.amount < 0 ? "spent" : "received"}
					>
						{record.amount < 0 ? "-" : "+"}
					</Badge>
				)}
			/>

			<DataTable.Col
				source="amount"
				render={(record) => {
					return <>{Math.abs(record.amount)}</>;
				}}
			/>

			<DataTable.Col label={"Row number"}>
				<NumberField source="row_number"></NumberField>
			</DataTable.Col>

			<DataTable.Col source="description" />

			<DataTable.Col>
				<DateField source="date" />
			</DataTable.Col>

			<DataTable.Col
				source="status"
				render={(record) => {
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
					if (record.status === "pending") {
						return (
							<>
								<Button
									type="button"
									size="icon"
									onClick={async () => {
										await importRowAction({
											profile_id: userProfile.id,
											import_row_id: Number(record.id),
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
										await importRowAction({
											profile_id: userProfile.id,
											import_row_id: Number(record.id),
											action: "drop",
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
								variant="outline"
								onClick={async () => {
									await importRowAction({
										profile_id: userProfile.id,
										import_row_id: Number(record.id),
										action: "undo",
									});

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

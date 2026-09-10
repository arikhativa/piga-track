import { capitalize } from "lodash";
import { Spinner } from "#/components/admin/spinner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import type { ImportRow } from "#/db/schema";
import { useProfile } from "#/hooks/use-profile";
import { mergeImportRow } from "#/lib/importer/mergeImportRow";
import { getRowStateVariant } from "#/lib/variant/getRowStateVariant";
import {
	ColumnsButton,
	DataTable,
	DateField,
	List,
	NumberField,
} from "@/components/admin";

// actions={<>
//     <ColumnsButton />
//     <CreateButton />
//     <ExportButton />
// </>}
export const ImportRowDataTable = () => {
	const { isSuccess, data: userProfile } = useProfile();

	if (!isSuccess) return <Spinner />;

	return (
		<List>
			<DataTable>
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
					render={(record: ImportRow) => (
						<Button
							type="button"
							size="sm"
							onClick={async () => {
								await mergeImportRow({
									profile_id: userProfile.id,
									import_row_id: Number(record.id),
								});
							}}
							disabled={record.status !== "pending"}
						>
							Merge
						</Button>
					)}
				/>
			</DataTable>
		</List>
	);
};

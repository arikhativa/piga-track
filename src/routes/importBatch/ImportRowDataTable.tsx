import { capitalize } from "lodash";
import { Badge } from "#/components/ui/badge";
import { getRowStateVariant } from "#/lib/variant/getRowStateVariant";
import { DataTable, DateField, NumberField } from "@/components/admin";

export const ImportRowDataTable = () => {
	return (
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
		</DataTable>
	);
};

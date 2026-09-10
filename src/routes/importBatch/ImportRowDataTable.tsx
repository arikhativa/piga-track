import { DataTable, NumberField } from "@/components/admin";

export const ImportRowDataTable = () => {
	return (
		<DataTable>
			<DataTable.Col>
				<NumberField source="row_number"></NumberField>
			</DataTable.Col>
		</DataTable>
	);
};

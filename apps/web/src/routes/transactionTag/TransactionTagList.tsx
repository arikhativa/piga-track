import { DataTable, List } from "@/components/admin";

export const TransactionTagList = () => (
	<List>
		<DataTable>
			<DataTable.Col source="value" />
		</DataTable>
	</List>
);

import { DataTable, List } from "@/components/admin";

export const PotList = () => (
	<List>
		<DataTable>
			<DataTable.Col source="name" />
		</DataTable>
	</List>
);

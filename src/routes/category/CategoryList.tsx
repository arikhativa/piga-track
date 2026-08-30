import { DataTable, List } from "@/components/admin";

export const CategoryList = () => (
	<List>
		<DataTable>
			<DataTable.Col source="value" label="Name" />
		</DataTable>
	</List>
);

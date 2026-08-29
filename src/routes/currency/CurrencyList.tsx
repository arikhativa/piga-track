import { DataTable, List } from "@/components/admin";

export const CurrencyList = () => (
	<List>
		<DataTable>
			<DataTable.Col source="symbol" />
			<DataTable.Col source="iso_code" />
			<DataTable.Col source="name" />
		</DataTable>
	</List>
);

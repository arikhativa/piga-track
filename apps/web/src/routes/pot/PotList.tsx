import { DEFAULT_PER_PAGE } from "#/lib/constant";
import { DataTable, List } from "@/components/admin";

export const PotList = () => (
	<List perPage={DEFAULT_PER_PAGE}>
		<DataTable>
			<DataTable.Col source="name" />
		</DataTable>
	</List>
);

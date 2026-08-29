import type { TransactionType } from "#/db/schema";
import { PotBalance } from "#/routes/pot/PotBalance";
import { DataTable, List } from "@/components/admin";

export const PotList = () => (
	<List>
		<DataTable>
			<DataTable.Col source="name" />
			<DataTable.Col
				label="Balance"
				render={(record: TransactionType) => <PotBalance record={record} />}
			/>
		</DataTable>
	</List>
);

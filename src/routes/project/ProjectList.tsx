import { DataTable, List } from "@/components/admin";

export const ProjectList = () => (
	<List>
		<DataTable>
			<DataTable.Col label="Name" source="value" />
			<DataTable.Col
				source="transaction_at"
				render={(record) =>
					new Date(record.transaction_at).toLocaleDateString("he-IL")
				}
			/>
		</DataTable>
	</List>
);

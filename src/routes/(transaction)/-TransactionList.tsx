import { Badge } from "#/components/ui/badge";
import { ProfileFullName } from "#/routes/(profile)/-ProfileFullName";
import { DataTable, List, ReferenceField } from "@/components/admin";

export const TransactionList = () => (
	<List>
		<DataTable>
			<DataTable.Col
				label="Type"
				render={(record) => (
					<Badge variant={record.amount < 0 ? "pink" : "green"}>
						{record.amount < 0 ? "Spent" : "Received"}
					</Badge>
				)}
			/>

			<DataTable.Col label="Tag">
				<ReferenceField
					source="tag_id"
					reference="transaction_tag"
					render={({ referenceRecord }) =>
						referenceRecord ? referenceRecord.value : null
					}
				></ReferenceField>
			</DataTable.Col>

			<DataTable.Col
				source="amount"
				render={(record) => Math.abs(record.amount)}
			/>

			<DataTable.Col
				source="created_at"
				render={(record) =>
					new Date(record.created_at).toLocaleDateString("he-IL")
				}
			/>
			<DataTable.Col label="Owner">
				<ProfileFullName />
			</DataTable.Col>
		</DataTable>
	</List>
);

import { Badge } from "#/components/ui/badge";
import { useCurrenciesForTransactions } from "#/hooks/use-currencies-for-transactions";
import { ProfileFullName } from "#/routes/profile/ProfileFullName";
import { DataTable, List, ReferenceField } from "@/components/admin";

export const TransactionList = () => {
	const { data } = useCurrenciesForTransactions();
	return (
		<List sort={{ field: "created_at", order: "DESC" }}>
			<DataTable>
				<DataTable.Col
					label="Type"
					render={(record) => (
						<Badge variant={record.amount < 0 ? "spent" : "received"}>
							{record.amount < 0 ? "Spent" : "Received"}
						</Badge>
					)}
				/>

				<DataTable.Col
					source="amount"
					render={(record) => {
						const currency = data?.find(
							(currency) => currency.id === record.currency_id,
						);

						return (
							<>
								{Math.abs(record.amount)} {currency?.symbol}
							</>
						);
					}}
				/>

				<DataTable.Col label="Category">
					<ReferenceField
						source="category_id"
						reference="transaction_category"
						render={({ referenceRecord }) =>
							referenceRecord ? referenceRecord.value : null
						}
					></ReferenceField>
				</DataTable.Col>

				<DataTable.Col label="Project">
					<ReferenceField
						source="project_id"
						reference="transaction_project"
						render={({ referenceRecord }) =>
							referenceRecord ? referenceRecord.value : null
						}
					></ReferenceField>
				</DataTable.Col>

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
};

import type { Currency } from "#/db/schema";
import { currencyOptionText } from "#/lib/form/currencyOptionText";
import { DataTable, List, ReferenceField } from "@/components/admin";

export const ImportProfileList = () => (
	<List>
		<DataTable>
			<DataTable.Col source="name" />
			<DataTable.Col source="currency_id">
				<ReferenceField
					source="currency_id"
					reference="currency"
					render={({ referenceRecord }) =>
						currencyOptionText(referenceRecord as Currency)
					}
				></ReferenceField>
			</DataTable.Col>
			<DataTable.Col
				source="transaction_at"
				render={(record) =>
					new Date(record.transaction_at).toLocaleDateString("he-IL")
				}
			/>
		</DataTable>
	</List>
);

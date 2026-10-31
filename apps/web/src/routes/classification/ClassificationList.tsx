import type { TransactionClassificationRuleActionEnum } from "@piga/db/types";
import { getEnumLabel } from "#/lib/enum-labels";
import { DataTable, List, ReferenceField } from "@/components/admin";

export const ClassificationList = () => (
	<List>
		<DataTable>
			<DataTable.Col source="text_to_find" />

			<DataTable.Col
				label="Action"
				render={({ action }) =>
					getEnumLabel(
						"classificationRuleAction",
						action as TransactionClassificationRuleActionEnum,
					)
				}
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

			<DataTable.Col label="Content">
				<ReferenceField
					source="tag_id"
					reference="transaction_tag"
					render={({ referenceRecord }) =>
						referenceRecord ? referenceRecord.value : null
					}
				></ReferenceField>
			</DataTable.Col>
		</DataTable>
	</List>
);

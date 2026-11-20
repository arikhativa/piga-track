import type { Transaction } from "@piga/db/types";
import { DataTableAmount } from "#/components/custom-ui/DataTableAmount";
import { toSmallDate } from "#/lib/format/toSmallDate";
import { ProfileFullName } from "#/routes/profile/ProfileFullName";
import { DataTable, ReferenceField } from "@/components/admin";
import type { DataTableProps } from "@/components/admin/data-table";

export const TransactionDataTable = ({
	...props
}: Omit<DataTableProps<Transaction>, "children"> & {}) => {
	return (
		<DataTable<Transaction> {...props}>
			<DataTableAmount<Transaction> source="amount_nis" />

			<DataTable.Col source="description" />

			<DataTable.Col source="sub_category_id" label="Sub Category">
				<ReferenceField
					source="sub_category_id"
					reference="transaction_category"
					render={({ referenceRecord }) =>
						referenceRecord ? referenceRecord.value : null
					}
				></ReferenceField>
			</DataTable.Col>

			<DataTable.Col source="category_id" label="Category" disableSort>
				<ReferenceField
					source="category_id"
					reference="transaction_category"
					render={({ referenceRecord }) =>
						referenceRecord ? referenceRecord.value : null
					}
				></ReferenceField>
			</DataTable.Col>

			<DataTable.Col source="project_id" label="Project" disableSort>
				<ReferenceField
					source="project_id"
					reference="transaction_project"
					render={({ referenceRecord }) =>
						referenceRecord ? referenceRecord.value : null
					}
				></ReferenceField>
			</DataTable.Col>

			<DataTable.Col
				source="transaction_at"
				label="Date"
				render={(record) => toSmallDate(record.transaction_at)}
			/>

			<DataTable.Col source="profile_id" label="Owner" disableSort>
				<ProfileFullName />
			</DataTable.Col>
		</DataTable>
	);
};

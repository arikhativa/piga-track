import type { Transaction } from "@piga/db/types";
import type { ReactNode } from "react";
import { DataTableAmount } from "#/components/custom-ui/DataTableAmount";
import { toSmallDate, toTime } from "#/lib/format/toSmallDate";
import { ProfileFullName } from "#/routes/profile/ProfileFullName";
import { DataTable, ReferenceField } from "@/components/admin";

type ColToHideOptions = "project" | "category" | "tag";

export const TransactionDataTable = ({
	colToHide,
	bulkActionButtons,
	disableSortCreatedAt,
}: {
	colToHide?: ColToHideOptions[];
	disableSortCreatedAt?: boolean;
	bulkActionButtons?: ReactNode;
}) => {
	return (
		<DataTable<Transaction> bulkActionButtons={bulkActionButtons}>
			<DataTableAmount<Transaction> source="amount_nis" />

			<DataTable.Col source="description" />

			{colToHide?.includes("category") ? null : (
				<DataTable.Col source="sub_category_id" label="Sub Category">
					<ReferenceField
						source="sub_category_id"
						reference="transaction_category"
						render={({ referenceRecord }) =>
							referenceRecord ? referenceRecord.value : null
						}
					></ReferenceField>
				</DataTable.Col>
			)}

			{colToHide?.includes("category") ? null : (
				<DataTable.Col source="category_id" label="Category" disableSort>
					<ReferenceField
						source="category_id"
						reference="transaction_category"
						render={({ referenceRecord }) =>
							referenceRecord ? referenceRecord.value : null
						}
					></ReferenceField>
				</DataTable.Col>
			)}

			{colToHide?.includes("project") ? null : (
				<DataTable.Col source="project_id" label="Project" disableSort>
					<ReferenceField
						source="project_id"
						reference="transaction_project"
						render={({ referenceRecord }) =>
							referenceRecord ? referenceRecord.value : null
						}
					></ReferenceField>
				</DataTable.Col>
			)}

			<DataTable.Col
				disableSort={disableSortCreatedAt}
				source="transaction_at"
				render={(record) => (
					<div>{`${toSmallDate(record.transaction_at)} - ${toTime(record.transaction_at)}`}</div>
				)}
			/>

			<DataTable.Col source="profile_id" label="Owner" disableSort>
				<ProfileFullName />
			</DataTable.Col>
		</DataTable>
	);
};

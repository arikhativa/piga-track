import type { ReactNode } from "react";
import { Badge } from "#/components/ui/badge";
import { useCurrenciesForTransactions } from "#/hooks/use-currencies-for-transactions";
import { toSmallDate, toTime } from "#/lib/format/toSmallDate";
import { ProfileFullName } from "#/routes/profile/ProfileFullName";
import { DataTable, ReferenceField } from "@/components/admin";

type ColToHideOptions = "project" | "category" | "tag";

export const TransactionDataTable = ({
	colToHide,
	bulkActionButtons,
}: {
	colToHide?: ColToHideOptions[];
	bulkActionButtons?: ReactNode;
}) => {
	const { data } = useCurrenciesForTransactions();
	return (
		<DataTable bulkActionButtons={bulkActionButtons}>
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
			{colToHide?.includes("tag") ? null : (
				<DataTable.Col label="Content">
					<ReferenceField
						source="tag_id"
						reference="transaction_tag"
						render={({ referenceRecord }) =>
							referenceRecord ? referenceRecord.value : null
						}
					></ReferenceField>
				</DataTable.Col>
			)}

			{colToHide?.includes("category") ? null : (
				<DataTable.Col label="Category">
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
				<DataTable.Col label="Project">
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
				source="created_at"
				render={(record) => toSmallDate(record.created_at)}
			/>

			<DataTable.Col
				label="Time"
				render={(record) => toTime(record.created_at)}
			/>

			<DataTable.Col label="Owner">
				<ProfileFullName />
			</DataTable.Col>
		</DataTable>
	);
};

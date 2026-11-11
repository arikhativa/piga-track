import { NIS_ID } from "@piga/db/schema";
import type { Transaction } from "@piga/db/types";
import type { ReactNode } from "react";
import { DataTableSignCol } from "#/components/custom-ui/DataTableSignCol";
import { useCurrencyList } from "#/hooks/use-currency-list";
import { formatCurrency, formatNIS } from "#/lib/format/formatNIS";
import { toSmallDate, toTime } from "#/lib/format/toSmallDate";
import { ProfileFullName } from "#/routes/profile/ProfileFullName";
import { DataTable, ReferenceField } from "@/components/admin";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

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
	const { data } = useCurrencyList();
	return (
		<DataTable<Transaction> bulkActionButtons={bulkActionButtons}>
			<DataTableSignCol />

			<DataTable.Col
				source="amount_nis"
				label="Amount"
				render={(record: Transaction) => {
					const nisAmount =
						record.amount_nis != null
							? formatNIS(Math.abs(Number(record.amount_nis)))
							: null;
					let amount: ReactNode = nisAmount ?? "--";

					if (
						record.amount_nis == null ||
						Number(record.amount) !== Number(record.amount_nis)
					) {
						const currency = data?.find(
							(currency) => currency.id === record.currency_id,
						);

						amount = (
							<>
								{formatCurrency(Math.abs(Number(record.amount)))}{" "}
								{currency?.symbol}
							</>
						);
					}

					if (record.currency_id === NIS_ID || record.amount_nis == null)
						return amount;

					return (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger render={<span>{amount}</span>}></TooltipTrigger>
								<TooltipContent>{nisAmount}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					);
				}}
			/>

			<DataTable.Col source="description" />

			{colToHide?.includes("category") ? null : (
				<DataTable.Col label="Sub Category">
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
				disableSort={disableSortCreatedAt}
				source="transaction_at"
				render={(record) => (
					<div>{`${toSmallDate(record.transaction_at)} - ${toTime(record.transaction_at)}`}</div>
				)}
			/>

			<DataTable.Col label="Owner">
				<ProfileFullName />
			</DataTable.Col>
		</DataTable>
	);
};

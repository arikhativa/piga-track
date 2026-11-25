import type { Transaction, TransactionType } from "@piga/db/schema";
import type { Identifier, RaRecord } from "ra-core";
import type { DataTableColumnProps } from "#/components/admin";
import { DataTable, ReferenceField } from "#/components/admin";
import { TransactionTypeBadge } from "#/components/transaction-type-badges/TransactionTypeBadge";
export function DataTableTransactionTypeCol<
	RecordType extends RaRecord<Identifier> & Transaction,
>(props: DataTableColumnProps<RecordType>) {
	return (
		<DataTable.Col {...props} label={"Type"}>
			<ReferenceField<Transaction, TransactionType>
				source="transaction_type_id"
				reference="transaction_type"
				link={false}
				render={({ referenceRecord }) => (
					<TransactionTypeBadge typeId={referenceRecord?.id} />
				)}
			/>
		</DataTable.Col>
	);
}

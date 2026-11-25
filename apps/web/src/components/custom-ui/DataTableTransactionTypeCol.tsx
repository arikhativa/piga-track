import type { Transaction, TransactionType } from "@piga/db/schema";
import type { Identifier, RaRecord } from "ra-core";
import type { DataTableColumnProps } from "#/components/admin";
import { DataTable, ReferenceField } from "#/components/admin";
import { FibiBadge } from "#/components/transaction-type-badges/FibiBadge";
import { MaxBadge } from "#/components/transaction-type-badges/MaxBadge";

// TODO: the Ids should not be dynamic
export function DataTableTransactionTypeCol<
	RecordType extends RaRecord<Identifier> & Transaction,
>(props: DataTableColumnProps<RecordType>) {
	return (
		<DataTable.Col {...props} label={"Type"}>
			<ReferenceField<Transaction, TransactionType>
				source="transaction_type_id"
				reference="transaction_type"
				link={false}
				render={({ referenceRecord }) => {
					if (referenceRecord?.id === 6) {
						return <MaxBadge />;
					}
					if (referenceRecord?.id === 4) {
						return <FibiBadge />;
					}
					return null;
				}}
			/>
		</DataTable.Col>
	);
}

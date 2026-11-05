import { DEFAULT_PER_PAGE } from "#/lib/constant";
import { DataTable, List, ReferenceField } from "@/components/admin";

export const AutoSyncConfList = () => (
	<List perPage={DEFAULT_PER_PAGE} sort={{ field: "id", order: "ASC" }}>
		<DataTable bulkActionButtons={false} rowClick="edit">
			<DataTable.Col source="src_name" label="Source" />
			<DataTable.Col source="src_label" label="Label" />
			<DataTable.Col source="lookback_days" label="Lookback days" />
			<DataTable.Col
				source="is_enabled"
				label="Enabled"
				render={(record) => (record.is_enabled ? "Yes" : "No")}
			/>
			<DataTable.Col source="transaction_type_id" label="Transaction type">
				<ReferenceField
					source="transaction_type_id"
					reference="transaction_type"
				/>
			</DataTable.Col>
			<DataTable.Col
				source="credentials_secret_id"
				label="Credentials"
				disableSort
				render={(record) =>
					record.credentials_secret_id ? "Configured" : "Not configured"
				}
			/>
		</DataTable>
	</List>
);

import { DEFAULT_PER_PAGE } from "#/lib/constant";
import { DataTable, List } from "@/components/admin";

export const ProfileList = () => (
	<List perPage={DEFAULT_PER_PAGE}>
		<DataTable>
			<DataTable.Col source="first_name" />
			<DataTable.Col source="last_name" />
			<DataTable.Col source="email" />
			<DataTable.Col
				source="credit_card"
				label="Credit cards"
				render={(record) => record.credit_card?.join(", ") || "--"}
			/>
		</DataTable>
	</List>
);

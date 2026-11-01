import { DEFAULT_PER_PAGE } from "#/lib/constant";
import { BooleanField, DataTable, List } from "@/components/admin";

export const CategoryList = () => (
	<List perPage={DEFAULT_PER_PAGE}>
		<DataTable>
			<DataTable.Col source="value" label="Name" />
			<DataTable.Col source="is_expense">
				<BooleanField source={"is_expense"}></BooleanField>
			</DataTable.Col>
			<DataTable.Col source="is_income">
				<BooleanField source={"is_income"}></BooleanField>
			</DataTable.Col>
		</DataTable>
	</List>
);

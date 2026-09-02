import type { TransactionProject } from "#/db/schema";
import { ProjectCosts } from "#/routes/project/ProjectCosts";
import { DataTable, List } from "@/components/admin";

export const ProjectList = () => (
	<List>
		<DataTable>
			<DataTable.Col label="Name" source="value" />
			<DataTable.Col
				label="Sum of Costs"
				render={(record: TransactionProject) => (
					<>
						<ProjectCosts record={record} /> ₪
					</>
				)}
			/>
			<DataTable.Col
				source="created_at"
				render={(record) =>
					new Date(record.created_at).toLocaleDateString("he-IL")
				}
			/>
		</DataTable>
	</List>
);

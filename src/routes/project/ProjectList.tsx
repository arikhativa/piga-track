import type { TransactionProject } from "#/db/schema";
import { ProjectCosts } from "#/routes/project/ProjectCosts";
import { DataTable, List } from "@/components/admin";

export const ProjectList = () => (
	<List>
		<DataTable>
			<DataTable.Col source="value" />
			<DataTable.Col
				label="Costs in ₪"
				render={(record: TransactionProject) => (
					<ProjectCosts record={record} />
				)}
			/>
		</DataTable>
	</List>
);

import { useDataProvider, useGetList, useRefresh } from "ra-core";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";
import type { ImportRow, TransactionProject } from "#/db/schema";

export function ImportRowProject({ record }: { record: ImportRow }) {
	const dataProvider = useDataProvider();
	const refresh = useRefresh();

	const { data: projects = [], isPending } = useGetList<TransactionProject>(
		"transaction_project",
		{
			pagination: {
				page: 1,
				perPage: 1000,
			},
			sort: {
				field: "value",
				order: "ASC",
			},
		},
	);

	const handleChange = async (value: string | number) => {
		await dataProvider.update("import_row", {
			id: record.id,
			data: {
				project_id: value ? Number(value) : null,
			},
			previousData: record,
		});

		refresh();
	};

	return (
		<DynamicSelect
			disabled={record.status !== "pending"}
			choices={projects}
			value={record.project_id}
			optionText="value"
			emptyText="Project"
			isPending={isPending}
			onChange={handleChange}
		/>
	);
}

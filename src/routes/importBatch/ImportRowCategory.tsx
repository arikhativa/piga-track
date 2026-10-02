import { useDataProvider, useGetList, useRefresh } from "ra-core";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";
import type { ImportRow, TransactionCategory } from "#/db/schema";

export function ImportRowCategory({ record }: { record: ImportRow }) {
	const dataProvider = useDataProvider();
	const refresh = useRefresh();

	const { data: categories = [], isPending } = useGetList<TransactionCategory>(
		"transaction_category",
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
				category_id: value ? Number(value) : null,
			},
			previousData: record,
		});

		refresh();
	};

	return (
		<DynamicSelect
			disabled={record.status !== "pending"}
			choices={categories}
			value={record.category_id}
			optionText="value"
			emptyText="Category"
			isPending={isPending}
			onChange={handleChange}
		/>
	);
}

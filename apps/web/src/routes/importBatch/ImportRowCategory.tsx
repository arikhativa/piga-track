import type { ImportRow, TransactionCategory } from "@piga/db/types";
import { useCreate, useDataProvider, useGetList, useRefresh } from "ra-core";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";

export function ImportRowCategory({ record }: { record: ImportRow }) {
	const dataProvider = useDataProvider();
	const refresh = useRefresh();
	const [create] = useCreate();

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

	const handleCreate = async (value: string) => {
		const category = await create(
			"transaction_category",
			{
				data: { value },
			},
			{
				returnPromise: true,
			},
		);

		return category.id;
	};

	const handleChange = async (value: string | number | null) => {
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
			onCreate={handleCreate}
			onChange={handleChange}
		/>
	);
}

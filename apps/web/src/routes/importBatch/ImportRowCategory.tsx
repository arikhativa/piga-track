import type { ImportRow } from "@piga/db/types";
import { useCreate, useDataProvider, useRefresh } from "ra-core";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";
import { useCategoryList } from "#/hooks/use-category-list";

export function ImportRowCategory({ record }: { record: ImportRow }) {
	const dataProvider = useDataProvider();
	const refresh = useRefresh();
	const [create] = useCreate();

	const { data: categories = [], isPending } = useCategoryList();
	const parentCategories = categories.filter(
		(category) => category.parent_id == null,
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
				...(record.category_id !== (value ? Number(value) : null)
					? { sub_category_id: null }
					: {}),
			},
			previousData: record,
		});

		refresh();
	};

	return (
		<DynamicSelect
			disabled={record.status !== "pending"}
			choices={parentCategories}
			value={record.category_id}
			optionText="value"
			emptyText="Category"
			isPending={isPending}
			onCreate={handleCreate}
			onChange={handleChange}
		/>
	);
}

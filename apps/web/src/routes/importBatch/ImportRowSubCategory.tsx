import type { ImportRow } from "@piga/db/types";
import { useCreate, useDataProvider, useRefresh } from "ra-core";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";
import { useCategoryList } from "#/hooks/use-category-list";

export function ImportRowSubCategory({ record }: { record: ImportRow }) {
	const dataProvider = useDataProvider();
	const refresh = useRefresh();
	const [create] = useCreate();

	const { data: categories = [], isPending } = useCategoryList();
	const subCategories = categories.filter(
		(category) =>
			record.category_id != null && category.parent_id === record.category_id,
	);

	const handleCreate = async (value: string) => {
		if (record.category_id == null) throw new Error("Select a category first.");
		const category = await create(
			"transaction_category",
			{
				data: { value, parent_id: record.category_id },
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
				sub_category_id: value == null ? null : Number(value),
			},
			previousData: record,
		});

		refresh();
	};

	return (
		<DynamicSelect
			disabled={record.status !== "pending" || record.category_id == null}
			choices={subCategories}
			value={record.sub_category_id}
			optionText="value"
			emptyText={
				record.category_id == null ? "Select a category first" : "Subcategory"
			}
			isPending={isPending}
			onCreate={handleCreate}
			onChange={handleChange}
		/>
	);
}

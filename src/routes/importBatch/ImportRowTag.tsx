import { useCreate, useDataProvider, useGetList, useRefresh } from "ra-core";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";
import type { ImportRow, TransactionTag } from "#/db/schema";

export function ImportRowTag({ record }: { record: ImportRow }) {
	const dataProvider = useDataProvider();
	const refresh = useRefresh();
	const [create] = useCreate();

	const { data: tagList = [], isPending } = useGetList<TransactionTag>(
		"transaction_tag",
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
		const tag = await create(
			"transaction_tag",
			{
				data: { value },
			},
			{
				returnPromise: true,
			},
		);

		return tag.id;
	};

	const handleChange = async (value: string | number | null) => {
		await dataProvider.update("import_row", {
			id: record.id,
			data: {
				tag_id: value ? Number(value) : null,
			},
			previousData: record,
		});

		refresh();
	};

	return (
		<DynamicSelect
			disabled={record.status !== "pending"}
			choices={tagList}
			value={record.tag_id}
			onCreate={handleCreate}
			optionText="value"
			isPending={isPending}
			onChange={handleChange}
		/>
	);
}

import { useDataProvider, useGetList, useRefresh } from "ra-core";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";
import type { ImportRow, TransactionTag } from "#/db/schema";

export function ImportRowTag({ record }: { record: ImportRow }) {
	const dataProvider = useDataProvider();
	const refresh = useRefresh();

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

	const handleChange = async (value: string | number) => {
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
			optionText="value"
			isPending={isPending}
			onChange={handleChange}
		/>
	);
}

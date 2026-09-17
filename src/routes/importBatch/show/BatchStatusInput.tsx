import { useDataProvider, useRecordContext, useRefresh } from "ra-core";
import { BatchStatusTabs } from "#/components/custom-ui/BatchStatusTabs";
import type { ImportBatch } from "#/db/schema";

export function BatchStatusInput() {
	const record = useRecordContext();
	const dataProvider = useDataProvider();
	const refresh = useRefresh();

	const handleChange = async (status: ImportBatch["status"]) => {
		if (!record?.id) return;

		await dataProvider.update("import_batch", {
			id: record.id,
			data: {
				status,
			},
			previousData: record,
		});
		refresh();
	};

	return <BatchStatusTabs status={record?.status} setStatus={handleChange} />;
}

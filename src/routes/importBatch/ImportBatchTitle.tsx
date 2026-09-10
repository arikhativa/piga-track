import { useRecordContext } from "ra-core";
import { Spinner } from "#/components/admin/spinner";
import type { ImportBatch } from "#/db/schema";

export const ImportBatchTitle = () => {
	const record = useRecordContext<ImportBatch>();

	if (!record) {
		return <Spinner />;
	}
	return <span>{record.batch_name}</span>;
};

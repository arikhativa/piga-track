import { useRecordContext } from "ra-core";
import { Spinner } from "#/components/admin/spinner";
import type { ImportBatch } from "#/db/schema";

export const ImportBatchTitle = () => {
	const record = useRecordContext<ImportBatch>();

	if (!record) {
		return <Spinner />;
	}
	return record.batch_name;
};

import type { ImportBatch } from "@piga/db/types";
import { useRecordContext } from "ra-core";
import { Spinner } from "#/components/admin/spinner";

export const ImportBatchTitle = () => {
	const record = useRecordContext<ImportBatch>();

	if (!record) {
		return <Spinner />;
	}
	return record.batch_name;
};

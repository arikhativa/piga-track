import { useRecordContext } from "ra-core";
import { Spinner } from "#/components/admin/spinner";
import type { TransactionProject } from "#/db/schema";

export const ProjectTitle = () => {
	const record = useRecordContext<TransactionProject>();

	if (!record) {
		return <Spinner />;
	}
	return <span>{record.value}</span>;
};

import type { TransactionProject } from "@piga/db/types";
import { useRecordContext } from "ra-core";
import { Spinner } from "#/components/admin/spinner";

export const ProjectTitle = () => {
	const record = useRecordContext<TransactionProject>();

	if (!record) {
		return <Spinner />;
	}
	return <span>{record.value}</span>;
};

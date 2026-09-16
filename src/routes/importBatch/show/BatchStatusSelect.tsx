import { useDataProvider, useRecordContext, useRefresh } from "ra-core";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";

const importBatchStatuses = [
	{ id: "draft", name: "Draft" },
	{ id: "approved", name: "Approved" },
	{ id: "cancelled", name: "Cancelled" },
] as const;

export function BatchStatusSelect() {
	const record = useRecordContext();
	const dataProvider = useDataProvider();
	const refresh = useRefresh();

	const handleChange = async (status: string) => {
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

	const selectedStatus = importBatchStatuses.find(
		(status) => status.id === record?.status,
	);

	return (
		<Select value={record?.status} onValueChange={handleChange}>
			<SelectTrigger className="w-45">
				<SelectValue>{selectedStatus?.name ?? "Select status"}</SelectValue>
			</SelectTrigger>

			<SelectContent>
				{importBatchStatuses.map((status) => (
					<SelectItem key={status.id} value={status.id}>
						{status.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

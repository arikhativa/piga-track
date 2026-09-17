import { Minus, Plus } from "lucide-react";
import { DataTable } from "#/components/admin";
import { Badge } from "#/components/ui/badge";

export function DataTableSignCol() {
	return (
		<DataTable.Col
			label="Type"
			render={(record) => (
				<Badge
					className="aspect-square rounded-full  h-fit p-1 m-0 w-fit [&>svg]:size-2.5!"
					variant={record.amount < 0 ? "spent" : "received"}
				>
					{record.amount < 0 ? <Minus /> : <Plus />}
				</Badge>
			)}
		/>
	);
}

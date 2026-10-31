import { Minus, Plus } from "lucide-react";
import type { Identifier, RaRecord } from "ra-core";
import type { DataTableColumnProps } from "#/components/admin";
import { DataTable } from "#/components/admin";
import { Badge } from "#/components/ui/badge";

export function DataTableSignCol<
	RecordType extends RaRecord<Identifier> & {
		amount: string | number | null;
	} = RaRecord<Identifier> & { amount: string | number | null },
>(props: DataTableColumnProps<RecordType>) {
	return (
		<DataTable.Col
			{...props}
			label={props.label ?? "Type"}
			render={(record) => (
				<Badge
					className="aspect-square h-fit w-fit rounded-full p-1 m-0 [&>svg]:size-2.5!"
					variant={Number(record.amount) < 0 ? "spent" : "received"}
				>
					{Number(record.amount) < 0 ? <Minus /> : <Plus />}
				</Badge>
			)}
		/>
	);
}

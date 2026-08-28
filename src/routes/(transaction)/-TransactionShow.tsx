import { Badge } from "#/components/ui/badge";
import { NumberField } from "@/components/admin";
import { RecordField } from "@/components/admin/record-field";
import { Show } from "@/components/admin/show";

export const TransactionShow = () => (
	<Show>
		<div className="flex flex-col gap-4">
			<RecordField
				label="Type"
				render={(record) => (
					<Badge variant={record.amount < 0 ? "pink" : "green"}>
						{record.amount < 0 ? "Spent" : "Received"}
					</Badge>
				)}
			/>

			<RecordField
				source="amount"
				render={(record) => (
					<NumberField
						source="amount"
						record={{ ...record, amount: Math.abs(record.amount) }}
					/>
				)}
			/>

			<RecordField source="description" className="max-w-100" />
		</div>
	</Show>
);

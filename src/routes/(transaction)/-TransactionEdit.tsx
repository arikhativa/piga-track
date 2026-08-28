import { useState } from "react";
import { TransactionForm } from "#/routes/(transaction)/-TransactionForm";
import { Edit } from "@/components/admin";

export function TransactionEdit() {
	const [type, setType] = useState<"spent" | "received">("spent");

	return (
		<Edit
			transform={(data) => ({
				...data,
				amount:
					type === "received"
						? Math.abs(Number(data.amount))
						: -Math.abs(Number(data.amount)),
			})}
		>
			<TransactionForm type={type} setType={setType} />
		</Edit>
	);
}

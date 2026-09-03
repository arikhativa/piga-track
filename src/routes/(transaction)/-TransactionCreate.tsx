import { useState } from "react";
import { TransactionForm } from "#/routes/(transaction)/-TransactionForm";
import { Create } from "@/components/admin";

export function TransactionCreate() {
	const [type, setType] = useState<"spent" | "received">("spent");

	return (
		<Create
			redirect={"/"}
			transform={(data) => {
				const amount = type === "received" ? data.amount : -data.amount;

				return {
					...data,
					amount,
				};
			}}
		>
			<TransactionForm type={type} setType={setType} />
		</Create>
	);
}

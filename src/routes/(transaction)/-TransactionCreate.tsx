import { useState } from "react";
import { TransactionForm } from "#/routes/(transaction)/-TransactionForm";
import { Create } from "@/components/admin";

export function TransactionCreate() {
	const [key, setKey] = useState(1);
	const [type, setType] = useState<"spent" | "received">("spent");

	const onSuccess = () => {
		setKey((k) => ++k);
	};

	return (
		<Create
			redirect={"create"}
			mutationOptions={{ onSuccess }}
			transform={(data) => {
				const amount = type === "received" ? data.amount : -data.amount;

				return {
					...data,
					amount,
				};
			}}
		>
			<TransactionForm key={key} type={type} setType={setType} />
		</Create>
	);
}

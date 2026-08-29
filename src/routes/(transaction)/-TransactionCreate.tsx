import { useState } from "react";
import { useProfile } from "#/hooks/use-profile";
import { TransactionForm } from "#/routes/(transaction)/-TransactionForm";
import { Create } from "@/components/admin";

export function TransactionCreate() {
	const profile = useProfile();
	const [type, setType] = useState<"spent" | "received">("spent");

	return (
		<Create
			redirect={"create"}
			transform={(data) => {
				const amount = type === "received" ? data.amount : -data.amount;

				return {
					...data,
					profile_id: profile?.id,
					amount,
				};
			}}
		>
			<TransactionForm type={type} setType={setType} />
		</Create>
	);
}

import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { TransactionForm } from "#/routes/(transaction)/-TransactionForm";
import { Edit } from "@/components/admin";

export function TransactionEdit() {
	const [type, setType] = useState<"spent" | "received">("spent");
	// const navigate = useNavigate();

	// const onSuccess = () => navigate(-1);

	return (
		<Edit
			redirect={false}
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

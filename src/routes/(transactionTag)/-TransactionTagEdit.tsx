import { TransactionTagForm } from "#/routes/(transactionTag)/-TransactionTagForm";
import { Edit } from "@/components/admin";

export function TransactionTagEdit() {
	return (
		<Edit>
			<TransactionTagForm />
		</Edit>
	);
}

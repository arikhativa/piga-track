import { TransactionTagForm } from "#/routes/(transactionTag)/-TransactionTagForm";
import { Create } from "@/components/admin";

export function TransactionTagCreate() {
	return (
		<Create redirect={"list"}>
			<TransactionTagForm />
		</Create>
	);
}

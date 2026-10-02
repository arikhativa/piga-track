import { useState } from "react";
import { useCurrencyList } from "#/hooks/use-currency-list";
import { transactionTransform } from "#/lib/transaction/transactionTransform";
import { TransactionForm } from "#/routes/(transaction)/-TransactionForm";
import { Edit } from "@/components/admin";

export function TransactionEdit() {
	const [type, setType] = useState<"spent" | "received">("spent");
	const { data: currencyList } = useCurrencyList();

	return (
		<Edit redirect={false} transform={transactionTransform(type, currencyList)}>
			<TransactionForm type={type} setType={setType} />
		</Edit>
	);
}

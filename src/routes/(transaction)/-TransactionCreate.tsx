import { useState } from "react";
import { useCurrencyList } from "#/hooks/use-currency-list";
import { transactionTransform } from "#/lib/transaction/transactionTransform";
import { TransactionForm } from "#/routes/(transaction)/-TransactionForm";
import { Create } from "@/components/admin";

export function TransactionCreate() {
	const [type, setType] = useState<"spent" | "received">("spent");
	const { data: currencyList } = useCurrencyList();

	return (
		<Create redirect={"/"} transform={transactionTransform(type, currencyList)}>
			<TransactionForm type={type} setType={setType} />
		</Create>
	);
}

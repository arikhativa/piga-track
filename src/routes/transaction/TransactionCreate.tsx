import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Spinner } from "#/components/admin/spinner";
import { useCurrencyList } from "#/hooks/use-currency-list";
import { transactionTransform } from "#/lib/transaction/transactionTransform";
import { TransactionForm } from "#/routes/transaction/TransactionForm";
import { Create } from "@/components/admin";

export function TransactionCreate() {
	const [type, setType] = useState<"spent" | "received">("spent");
	const { data: currencyList, isSuccess, isPending } = useCurrencyList();
	const queryClient = useQueryClient();

	if (!isSuccess && isPending) {
		return <Spinner />;
	}

	return (
		<Create
			redirect={"/"}
			transform={transactionTransform({ type, currencyList, queryClient })}
		>
			<TransactionForm type={type} setType={setType} />
		</Create>
	);
}

import { useQueryClient } from "@tanstack/react-query";
import { EditContextProvider, useEditController } from "ra-core";
import { useState } from "react";
import { EditView } from "#/components/admin/edit";
import { Spinner } from "#/components/admin/spinner";
import { useCurrencyList } from "#/hooks/use-currency-list";
import { transactionTransform } from "#/lib/transaction/transactionTransform";
import { TransactionForm } from "#/routes/transaction/TransactionForm";

export function TransactionEdit() {
	const [selectedType, setSelectedType] = useState<"spent" | "received">();

	const { data: currencyList, isSuccess, isPending } = useCurrencyList();

	const queryClient = useQueryClient();

	const controller = useEditController({
		redirect: false,
		transform: (data, options) =>
			transactionTransform({
				type:
					selectedType ??
					(options?.previousData?.amount > 0 ? "received" : "spent"),
				currencyList,
				queryClient,
			})(data),
	});

	const type =
		selectedType ?? (controller.record?.amount > 0 ? "received" : "spent");

	if (!isSuccess && isPending) {
		return <Spinner />;
	}

	return (
		<EditContextProvider value={controller}>
			<EditView>
				<TransactionForm
					type={type}
					setType={(value) =>
						setSelectedType(typeof value === "function" ? value(type) : value)
					}
				/>
			</EditView>
		</EditContextProvider>
	);
}

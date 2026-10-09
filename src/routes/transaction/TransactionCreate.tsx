import { useQueryClient } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";
import { Spinner } from "#/components/admin/spinner";
import { Checkbox } from "#/components/ui/checkbox";
import { Label } from "#/components/ui/label";
import { useCurrencyList } from "#/hooks/use-currency-list";
import { transactionTransform } from "#/lib/transaction/transactionTransform";
import { TransactionForm } from "#/routes/transaction/TransactionForm";
import { CancelButton, Create, SaveButton } from "@/components/admin";

const FormToolbar = ({ children }: PropsWithChildren) => (
	<div
		className={
			"sticky pt-4 pb-4 md:block md:pt-2 md:pb-0 bottom-0 bg-linear-to-b from-transparent to-background to-10%"
		}
		role="toolbar"
	>
		<div className="flex flex-row gap-2 justify-end">
			{children}
			<div className="flex-1"></div>
			<CancelButton />
			<SaveButton />
		</div>
	</div>
);

export function TransactionCreate() {
	const [createMore, setCreateMore] = useState(false);
	const [type, setType] = useState<"spent" | "received">("spent");
	const { data: currencyList, isSuccess, isPending } = useCurrencyList();
	const queryClient = useQueryClient();

	if (!isSuccess && isPending) {
		return <Spinner />;
	}

	return (
		<Create
			redirect={createMore ? "create" : "/"}
			transform={transactionTransform({ type, currencyList, queryClient })}
		>
			<TransactionForm
				toolbar={
					<FormToolbar>
						<div className="flex  justify-between gap-2 items-center">
							<Checkbox
								id="create-more-transactions"
								name="create-more-transactions"
								checked={createMore}
								onCheckedChange={setCreateMore}
							/>
							<Label htmlFor="create-more-transactions">Create More</Label>
						</div>
					</FormToolbar>
				}
				type={type}
				setType={setType}
			/>
		</Create>
	);
}

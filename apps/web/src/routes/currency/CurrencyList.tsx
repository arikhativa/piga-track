import { useNotify } from "ra-core";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { useCurrencyList } from "#/hooks/use-currency-list";
import { fixAmountNisNull } from "#/lib/transaction/fixAmountNisNull";
import { DataTable, List } from "@/components/admin";

export const CurrencyList = () => {
	const notify = useNotify();
	const { data: currencyList, isSuccess } = useCurrencyList();
	const [isFixing, setIsFixing] = useState(false);

	const handleFixNull = async () => {
		if (!currencyList || isFixing) {
			return;
		}

		setIsFixing(true);

		notify("Fixing missing NIS amounts...", {
			type: "info",
		});

		try {
			const result = await fixAmountNisNull({
				currencyList,
			});

			notify(
				`NIS sync complete: ${result.updated} updated, ${result.failed} failed.`,
				{
					type: result.failed > 0 ? "warning" : "success",
				},
			);
		} catch (error) {
			console.error(error);

			notify("Failed to fix missing NIS amounts.", {
				type: "error",
			});
		} finally {
			setIsFixing(false);
		}
	};

	return (
		<List>
			<div className="py-4">
				<Button disabled={!isSuccess || isFixing} onClick={handleFixNull}>
					{isFixing ? "Fixing..." : "Fix Amount NIS"}
				</Button>
			</div>

			<DataTable>
				<DataTable.Col source="symbol" />
				<DataTable.Col source="iso_code" />
				<DataTable.Col source="name" />
			</DataTable>
		</List>
	);
};

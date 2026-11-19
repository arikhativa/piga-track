import { NIS_ID } from "@piga/db/schema";
import { Minus, Plus } from "lucide-react";
import type { RaRecord } from "ra-core";
import type { ReactNode } from "react";
import { DataTable, type DataTableColumnProps } from "#/components/admin";
import { Badge } from "#/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { useCurrencyList } from "#/hooks/use-currency-list";
import { NO_VALUE } from "#/lib/constant";
import { formatCurrency, formatNIS } from "#/lib/format/formatNIS";

type AmountRecord = RaRecord & {
	amount: string | number | null;
	amount_nis: string | number | null;
	currency_id: number | null;
};

export function DataTableAmount<RecordType extends AmountRecord = AmountRecord>(
	props: DataTableColumnProps<RecordType>,
) {
	const { data } = useCurrencyList();

	return (
		<DataTable.Col
			{...props}
			source={props.source ?? "amount"}
			label={props.label ?? "Amount"}
			render={(record) => {
				const nisAmount =
					record.amount_nis != null
						? formatNIS(Math.abs(Number(record.amount_nis)))
						: null;
				let amount: ReactNode = nisAmount ?? NO_VALUE;

				if (
					record.amount_nis == null ||
					Number(record.amount) !== Number(record.amount_nis)
				) {
					const currency = data?.find(
						(currency) => currency.id === record.currency_id,
					);

					amount = (
						<>
							{formatCurrency(Math.abs(Number(record.amount)))}{" "}
							{currency?.symbol}
						</>
					);
				}

				if (record.currency_id !== NIS_ID && record.amount_nis != null) {
					amount = (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger render={<span>{amount}</span>} />
								<TooltipContent>{nisAmount}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					);
				}

				return (
					<span className="inline-flex items-center gap-2 whitespace-nowrap">
						<Badge
							className="aspect-square h-fit w-fit rounded-full p-1 m-0 [&>svg]:size-2.5!"
							variant={Number(record.amount) < 0 ? "spent" : "received"}
						>
							{Number(record.amount) < 0 ? <Minus /> : <Plus />}
						</Badge>
						{amount}
					</span>
				);
			}}
		/>
	);
}

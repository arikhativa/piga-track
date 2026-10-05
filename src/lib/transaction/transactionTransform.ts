import type { QueryClient } from "@tanstack/react-query";
import type { Currency, TransactionInsert } from "#/db/schema";
import { getExchangeRate, resolveAmountNis } from "#/lib/exchange-rate";

type TransactionFormData =
    & Omit<
        TransactionInsert,
        "currency_id" | "transaction_type_id" | "transaction_at"
    >
    & {
        currency_id: string;
        transaction_type_id: string;
        transaction_at: string;
    };

export const transactionTransform = (
    {
        type,
        currencyList,
        queryClient,
    }: {
        type: "spent" | "received";
        currencyList: Currency[] | undefined;
        queryClient: QueryClient;
    },
) => {
    return async (data: TransactionFormData) => {
        const amount = type === "received"
            ? Math.abs(Number(data.amount))
            : -Math.abs(Number(data.amount));

        const currencyId = Number(data.currency_id);

        const isoCode = currencyList?.find(
            (currency) => currency.id === currencyId,
        )?.iso_code;

        let amountNis: number | null = null;

        if (isoCode) {
            const date = new Date(data.transaction_at);
            const dateString = date.toISOString().slice(0, 10);

            const rate = await getExchangeRate({
                isoCode,
                dateString,
                queryClient,
            });

            if (rate) {
                amountNis = resolveAmountNis({
                    amount,
                    isoCode,
                    rate,
                });
            }
        }

        return {
            ...data,
            currency_id: currencyId,
            amount,
            amount_nis: amountNis,
            transaction_at: new Date(data.transaction_at),
        };
    };
};

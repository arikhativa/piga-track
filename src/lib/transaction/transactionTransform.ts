import type { Currency, TransactionInsert } from "#/db/schema";
import { resolveAmountNis } from "#/lib/exchange-rate";

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
    type: "spent" | "received",
    currencyList: Currency[] | undefined,
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
            amountNis = await resolveAmountNis({
                amount,
                isoCode,
                date: new Date(data.transaction_at),
            });
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

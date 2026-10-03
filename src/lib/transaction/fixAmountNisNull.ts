import type { Currency } from "#/db/schema";
import { BASE_CURRENCY } from "#/lib/constant";
import {
    callExchangeRateProviderRange,
    getExchangeRatesFromDB,
    insertExchangeRates,
    resolveAmountNis,
} from "#/lib/exchange-rate";
import { supabaseClient } from "#/lib/supabaseClient";

export async function fixAmountNisNull({
    currencyList,
}: {
    currencyList: Currency[];
}) {
    // 1. Get transactions missing amount_nis
    const { data: transactions, error: transactionsError } =
        await supabaseClient
            .from("transaction")
            .select("id, amount, currency_id, transaction_at")
            .is("amount_nis", null);

    if (transactionsError) {
        throw transactionsError;
    }

    if (!transactions?.length) {
        return {
            total: 0,
            updated: 0,
            failed: 0,
        };
    }

    const currencyMap = new Map(
        currencyList.map((currency) => [
            currency.id,
            currency.iso_code,
        ]),
    );

    // 2. Build required currency/date pairs
    const rateKeys = new Map<
        string,
        {
            isoCode: string;
            date: string;
        }
    >();

    for (const transaction of transactions) {
        const isoCode = currencyMap.get(transaction.currency_id);

        if (!isoCode || isoCode === BASE_CURRENCY) {
            continue;
        }

        const date = transaction.transaction_at.slice(0, 10);

        rateKeys.set(`${isoCode}:${date}`, {
            isoCode,
            date,
        });
    }

    const ratesNeeded = [...rateKeys.values()];

    // 3. Get all existing rates from DB
    let existingRates: Awaited<
        ReturnType<typeof getExchangeRatesFromDB>
    > = [];

    if (ratesNeeded.length) {
        const isoCodes = [
            ...new Set(
                ratesNeeded.map(({ isoCode }) => isoCode),
            ),
        ];

        const dates = ratesNeeded.map(({ date }) => date);

        const fromDate = dates.reduce((a, b) => a < b ? a : b);

        const toDate = dates.reduce((a, b) => a > b ? a : b);

        existingRates = await getExchangeRatesFromDB(
            isoCodes,
            fromDate,
            toDate,
        );
    }

    // 4. Build rate map
    const rateMap = new Map(
        existingRates.map((rate) => [
            `${rate.iso_code}:${rate.date}`,
            Number(rate.rate),
        ]),
    );

    // 5. Find missing rates
    const missingRates = ratesNeeded.filter(
        ({ isoCode, date }) => !rateMap.has(`${isoCode}:${date}`),
    );

    // 6. Fetch all missing rates from provider
    if (missingRates.length) {
        const isoCodes = [
            ...new Set(
                missingRates.map(({ isoCode }) => isoCode),
            ),
        ];

        const dates = missingRates.map(({ date }) => date);

        const fromDate = dates.reduce((a, b) => a < b ? a : b);

        const toDate = dates.reduce((a, b) => a > b ? a : b);

        try {
            const providerRates = await callExchangeRateProviderRange({
                isoCodes,
                fromDate,
                toDate,
            });

            // Only keep rates we actually need.
            const ratesToInsert = providerRates.filter(
                (rate) =>
                    rateMap.has(
                            `${rate.isoCode}:${rate.date}`,
                        ) === false &&
                    rateKeys.has(
                        `${rate.isoCode}:${rate.date}`,
                    ),
            );

            // 7. Bulk insert rates
            if (ratesToInsert.length) {
                await insertExchangeRates(ratesToInsert);

                for (const rate of ratesToInsert) {
                    rateMap.set(
                        `${rate.isoCode}:${rate.date}`,
                        rate.rate,
                    );
                }
            }
        } catch {
            // Leave unavailable rates unresolved.
        }
    }

    // 8. Calculate amount_nis
    const updates: {
        id: number;
        amount_nis: number;
    }[] = [];

    for (const transaction of transactions) {
        const isoCode = currencyMap.get(transaction.currency_id);

        if (!isoCode) {
            continue;
        }

        const amount = Number(transaction.amount);

        if (isoCode === BASE_CURRENCY) {
            updates.push({
                id: transaction.id,
                amount_nis: amount,
            });

            continue;
        }

        const date = transaction.transaction_at.slice(0, 10);

        const rate = rateMap.get(
            `${isoCode}:${date}`,
        );

        if (rate === undefined) {
            continue;
        }

        const amountNis = resolveAmountNis({
            amount,
            isoCode,
            rate,
        });

        if (amountNis !== null) {
            updates.push({
                id: transaction.id,
                amount_nis: amountNis,
            });
        }
    }

    // 9. Update transactions
    for (const update of updates) {
        const { error } = await supabaseClient
            .from("transaction")
            .update({
                amount_nis: update.amount_nis,
            })
            .eq("id", update.id);

        if (error) {
            throw error;
        }
    }

    return {
        total: transactions.length,
        updated: updates.length,
        failed: transactions.length - updates.length,
    };
}

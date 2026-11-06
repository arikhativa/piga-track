import type {
	AutoSyncConf,
	Currency,
	ImportRowInsert,
	TransactionType,
	Profile,
} from "@piga/db/schema";
import type { MaxTransaction } from "./parseTransaction.ts";

export interface MaxMappingContext {
	currencies: readonly Pick<Currency, "id" | "iso_numeric_code">[];
	profiles: readonly Pick<Profile, "id" | "credit_card">[];
}

export interface MappedMaxTransaction {
	refNbr: string;
	importRow: ImportRowInsert;
}

export function mapMaxTransaction(
	transactions: readonly MaxTransaction[],
	{ config, currencies, profiles }: MaxMappingContext,
): MappedMaxTransaction[] {
	return transactions.map((transaction) => {
		const matchingCurrencies = currencies.filter((currency) =>
			currency.iso_numeric_code === transaction.paymentCurrency
		);
		if (matchingCurrencies.length !== 1) {
			throw new Error("MAX payment currency could not be resolved uniquely");
		}

		const card = transaction.shortCardNumber;
		const profileIds = new Set(
			profiles.filter((profile) =>
				card && profile.credit_card?.some((value) => value.trim() === card)
			).map((profile) => profile.id),
		);
		const description = [
			transaction.merchantName,
			transaction.comments,
			transaction.planName,
			transaction.merchantData.address,
		].filter(Boolean).join(" | ");

		return {
			refNbr: transaction.dealData.refNbr,
			importRow: {
				// Preserve the upstream calendar date rather than shifting it across timezones.
				date: transaction.purchaseDate.slice(0, 10),
				amount: String(transaction.actualPaymentAmount),
				description: description || null,
				currency_id: matchingCurrencies[0].id,
				amount_nis: transaction.dealData.amountIls === null
					? null
					: String(transaction.dealData.amountIls),
				profile_id: profileIds.size === 1 ? [...profileIds][0] : null,
			},
		};
	});
}

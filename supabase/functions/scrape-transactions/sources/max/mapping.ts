import type { Currency, ImportRowInsert, Profile } from "@piga/db/schema";
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
	{ currencies, profiles }: MaxMappingContext,
): MappedMaxTransaction[] {
	return transactions.map((transaction) => {
		const matchingCurrencies = currencies.filter(
			(currency) => currency.iso_numeric_code === transaction.payment_currency,
		);
		if (matchingCurrencies.length !== 1) {
			throw new Error("MAX payment currency could not be resolved uniquely");
		}

		const card = transaction.short_card_number;
		const profileIds = new Set(
			profiles
				.filter(
					(profile) =>
						card && profile.credit_card?.some((value) => value.trim() === card),
				)
				.map((profile) => profile.id),
		);
		const description = [
			transaction.merchant_name,
			transaction.comments,
			transaction.plan_name,
			transaction.merchant_address,
		]
			.filter(Boolean)
			.join(" | ");

		return {
			refNbr: transaction.ref_nbr,
			importRow: {
				// Preserve the upstream calendar date rather than shifting it across timezones.
				date: transaction.purchase_date.toISOString().slice(0, 10),
				amount: transaction.actual_payment_amount,
				description: description || null,
				currency_id: matchingCurrencies[0].id,
				amount_nis: transaction.deal_amount_ils,
				profile_id: profileIds.size === 1 ? [...profileIds][0] : null,
			},
		};
	});
}

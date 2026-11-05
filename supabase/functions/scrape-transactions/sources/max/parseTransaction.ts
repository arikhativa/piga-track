import type { MaxSyncTableInsert } from "@piga/db/schema";
import { z } from "zod";

const optionalText = z
	.string()
	.trim()
	.nullish()
	.transform((value) => value ?? "");

export const maxTransactionSchema = z
	.object({
		actualPaymentAmount: z.number().finite(),
		paymentCurrency: z.number().int().min(1).max(999),
		purchaseDate: z.union([
			z.iso.date(),
			z.iso.datetime({ local: true, offset: true }),
		]),
		merchantName: optionalText,
		comments: optionalText,
		planName: optionalText,
		shortCardNumber: optionalText,
		merchantData: z
			.object({
				address: optionalText,
			})
			.nullish()
			.transform((value) => value ?? { address: "" }),
		dealData: z.object({
			refNbr: z.string().trim().min(1),
			amountIls: z
				.number()
				.finite()
				.nullish()
				.transform((value) => value ?? null),
		}),
	})
	.transform((transaction) => {
		// The database column has no timezone; preserve MAX's calendar date and wall time.
		const localDate = transaction.purchaseDate.replace(
			/(?:Z|[+-]\d{2}:\d{2})$/,
			"",
		);
		const purchaseDate = new Date(
			`${localDate.includes("T") ? localDate : `${localDate}T00:00:00`}Z`,
		);

		return {
			ref_nbr: transaction.dealData.refNbr,
			actual_payment_amount: String(transaction.actualPaymentAmount),
			payment_currency: transaction.paymentCurrency,
			purchase_date: purchaseDate,
			merchant_name: transaction.merchantName,
			comments: transaction.comments,
			plan_name: transaction.planName,
			short_card_number: transaction.shortCardNumber,
			merchant_address: transaction.merchantData.address,
			deal_amount_ils:
				transaction.dealData.amountIls === null
					? null
					: String(transaction.dealData.amountIls),
		} satisfies MaxSyncTableInsert;
	});

export const maxTransactionsSchema = z.array(maxTransactionSchema);

export type MaxTransaction = z.output<typeof maxTransactionSchema>;

export function parseTransaction(value: unknown): MaxTransaction[] {
	return maxTransactionsSchema.parse(value);
}

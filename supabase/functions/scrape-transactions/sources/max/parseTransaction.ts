import { z } from "zod";

const optionalText = z.string().trim().nullish().transform((value) => value ?? "");

export const maxTransactionSchema = z.object({
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
	merchantData: z.object({
		address: optionalText,
	}).nullish().transform((value) => value ?? { address: "" }),
	dealData: z.object({
		refNbr: z.string().trim().min(1),
		amountIls: z.number().finite().nullish().transform((value) => value ?? null),
	}),
});

export type MaxTransaction = z.output<typeof maxTransactionSchema>;

export function parseTransaction(value: unknown): MaxTransaction {
	return maxTransactionSchema.parse(value);
}

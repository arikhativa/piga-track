import { z } from "zod";

// HTTP records use ISO timestamp strings and PostgreSQL numeric strings, not Dates or numbers.
export const serializedImportBatchSchema = z.object({
	id: z.number().int(),
	import_profile_id: z.number().int(),
	batch_name: z.string(),
	status: z.enum(["draft", "approved", "cancelled"]),
	created_at: z.iso.datetime(),
	updated_at: z.iso.datetime(),
});

export const serializedImportRowSchema = z.object({
	id: z.number().int(),
	import_batch_id: z.number().int(),
	row_number: z.number().int(),
	date: z.iso.date().nullable(),
	amount: z.string(),
	description: z.string().nullable(),
	tag_id: z.number().int().nullable(),
	category_id: z.number().int().nullable(),
	project_id: z.number().int().nullable(),
	status: z.enum(["pending", "merged", "dropped", "duplicates"]),
	duplicate_transaction_id: z.number().int().nullable(),
	transaction_id: z.number().int().nullable(),
	created_at: z.iso.datetime(),
	updated_at: z.iso.datetime(),
});

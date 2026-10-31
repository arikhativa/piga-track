import { z } from "zod";
import {
	serializedImportBatchSchema,
	serializedImportRowSchema,
} from "./import-records.ts";

const importRowSchema = z.object({
	row_number: z.number().int().positive(),
	date: z.string().nullable(),
	amount: z.string(),
	tag_id: z.number().int().nullable().optional(),
	description: z.string().nullable().optional(),
	category_id: z.number().int().nullable().optional(),
	project_id: z.number().int().nullable().optional(),
});

export const createImportBatchSchema = z.object({
	batch_name: z.string().trim().min(1),
	import_profile_id: z.number().int().positive(),
	rows: z.array(importRowSchema),
});

export const createImportBatchRequestSchema = createImportBatchSchema;
export type CreateImportBatchInput = z.input<typeof createImportBatchSchema>;
export type CreateImportBatchRequestInput = z.input<
	typeof createImportBatchSchema
>;
export type CreateImportBatchRequest = z.output<typeof createImportBatchSchema>;

export const createImportBatchResponseSchema = z.object({
	batch: serializedImportBatchSchema,
	rows: z.array(serializedImportRowSchema),
});
export type CreateImportBatchResponse = z.output<
	typeof createImportBatchResponseSchema
>;

import { z } from "zod";
import { serializedImportRowSchema } from "./import-records.ts";

// TODO i need to rethink this tpye api share with supabse funcs
export const importRowActionSchema = z.object({
	import_row_ids: z.array(z.number().int().positive()),

	profileId: z.uuid(),

	action: z.enum([
		"mergeAllPending",
		"merge",
		"undo",
		"set_category",
		"set_project",
		"set_tag",
		"set_status",
	]),

	value: z.union([z.number().int(), z.string(), z.null()]).optional(),
});

export const importRowActionRequestSchema = importRowActionSchema;
export type ImportRowActionInput = z.input<typeof importRowActionSchema>;
export type ImportRowActionRequestInput = z.input<typeof importRowActionSchema>;
export type ImportRowActionRequest = z.output<typeof importRowActionSchema>;

// mergeAllPending delegates to merge and returns the action name "merge".
export const importRowActionResultSchema = z.discriminatedUnion("action", [
	z.object({
		action: z.literal("merge"),
		rows: z.array(z.object({ id: z.number().int() })),
	}),
	z.object({
		action: z.enum([
			"undo",
			"set_category",
			"set_project",
			"set_tag",
			"set_status",
		]),
		rows: z.array(serializedImportRowSchema),
	}),
]);

export const importRowActionResponseSchema = z.object({
	data: importRowActionResultSchema,
});

export type ImportRowActionResult = z.output<
	typeof importRowActionResultSchema
>;

export type ImportRowActionResponse = z.output<
	typeof importRowActionResponseSchema
>;

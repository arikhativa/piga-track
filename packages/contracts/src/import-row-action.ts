import { z } from "zod";
import { serializedImportRowSchema } from "./import-records.ts";

export const IMPORT_ROW_VISIBILITY_WINDOW_MS = 24 * 60 * 60 * 1000;

// TODO i need to rethink this tpye api share with supabse funcs
export const importRowActionSchema = z.object({
	import_row_ids: z.array(z.number().int().positive()),

	profileId: z.uuid().nullable().optional(),

	action: z.enum([
		"mergeAllPending",
		"merge",
		"undo",
		"set_category",
		"set_sub_category",
		"set_project",
		"set_tag",
		"set_status",
		"hide_rows",
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
			"set_sub_category",
			"set_project",
			"set_tag",
			"set_status",
			"hide_rows",
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

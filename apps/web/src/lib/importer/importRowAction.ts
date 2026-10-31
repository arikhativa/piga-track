import {
	type ImportRowActionInput,
	type ImportRowActionResponse,
	importRowActionRequestSchema,
	importRowActionResponseSchema,
} from "@piga/contracts/import-row-action";
import { supabaseClient } from "#/lib/supabaseClient";

export async function importRowAction(
	input: ImportRowActionInput,
): Promise<ImportRowActionResponse> {
	const body = importRowActionRequestSchema.parse(input);
	const { data, error } = await supabaseClient.functions.invoke(
		"import-row-action",
		{ body },
	);

	if (error) {
		throw error;
	}

	const response = importRowActionResponseSchema.safeParse(data);
	if (!response.success) {
		throw new Error(
			"import-row-action contract error: malformed successful response",
			{ cause: response.error },
		);
	}

	return response.data;
}

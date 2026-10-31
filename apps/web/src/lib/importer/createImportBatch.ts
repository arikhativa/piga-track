import {
	type CreateImportBatchInput,
	type CreateImportBatchResponse,
	createImportBatchRequestSchema,
	createImportBatchResponseSchema,
} from "@piga/contracts/create-import-batch";
import { supabaseClient } from "#/lib/supabaseClient";

export type { CreateImportBatchInput } from "@piga/contracts/create-import-batch";

export async function createImportBatch(
	input: CreateImportBatchInput,
): Promise<CreateImportBatchResponse> {
	const body = createImportBatchRequestSchema.parse(input);
	const { data, error } = await supabaseClient.functions.invoke(
		"create-import-batch",
		{ body },
	);

	if (error) {
		throw error;
	}

	const response = createImportBatchResponseSchema.safeParse(data);
	if (!response.success) {
		throw new Error(
			"create-import-batch contract error: malformed successful response",
			{ cause: response.error },
		);
	}

	return response.data;
}

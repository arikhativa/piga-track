import { supabaseClient } from "#/lib/supabaseClient";

type CreateImportBatchInput = {
	batch_name: string;
	import_profile_id: number;
	rows: {
		row_number: number;
		date: string | null;
		amount: string;
		tag_id?: number | null | undefined;
		description?: string | null | undefined;
		category_id?: number | null | undefined;
		project_id?: number | null | undefined;
	}[];
};
export async function createImportBatch(input: CreateImportBatchInput) {
	const { data, error } = await supabaseClient.functions.invoke(
		"create-import-batch",
		{
			body: input,
		},
	);

	if (error) {
		throw error;
	}

	return data;
}

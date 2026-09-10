import type { ImportRowData } from "#/db/schema";
import { supabaseClient } from "#/lib/supabaseClient";

export type CreateImportBatchInput = {
    batch_name: string;
    import_profile_id: number;
    rows: ImportRowData[];
};

export async function createImportBatch(
    input: CreateImportBatchInput,
) {
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

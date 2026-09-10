import { supabaseClient } from "#/lib/supabaseClient";

export async function createImportBatch(
    input: any,
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

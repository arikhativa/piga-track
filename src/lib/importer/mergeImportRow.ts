import type { ImportRow, Profile } from "#/db/schema";
import { supabaseClient } from "#/lib/supabaseClient";

interface MergeImportRowPrams {
    import_row_id: ImportRow["id"];
    profile_id: Profile["id"];
}

export async function mergeImportRow(
    input: MergeImportRowPrams,
) {
    const { data, error } = await supabaseClient.functions.invoke(
        "merge-import-row",
        {
            body: input,
        },
    );

    if (error) {
        throw error;
    }

    return data;
}

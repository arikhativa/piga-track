import type { ImportRow, Profile } from "#/db/schema";
import { supabaseClient } from "#/lib/supabaseClient";

type ImportRowAction = "merge" | "undo";

interface ImportRowActionParams {
    import_row_ids: ImportRow["id"][];
    profile_id: Profile["id"];
    action: ImportRowAction;
}

export async function importRowAction(input: ImportRowActionParams) {
    const { data, error } = await supabaseClient.functions.invoke(
        "import-row-action",
        {
            body: input,
        },
    );

    if (error) {
        throw error;
    }

    return data;
}

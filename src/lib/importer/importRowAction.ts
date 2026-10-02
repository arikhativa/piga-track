import { supabaseClient } from "#/lib/supabaseClient";
import type { ImportRowActionInput } from "../../../supabase/functions/import-row-action/schema";

export async function importRowAction(input: ImportRowActionInput) {
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

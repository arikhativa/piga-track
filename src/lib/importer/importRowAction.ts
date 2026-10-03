import { supabaseClient } from "#/lib/supabaseClient";

// TODO i need to rethink this tpye api share with supabse funcs
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

import { supabaseClient } from "#/lib/supabaseClient";

// TODO i need to rethink this tpye api share with supabse funcs
type ImportRowActionInput = {
    import_row_ids: number[];
    profileId: string;
    action:
        | "mergeAllPending"
        | "merge"
        | "undo"
        | "set_category"
        | "set_project"
        | "set_tag"
        | "set_status";
    value?: string | number | null | undefined;
};
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

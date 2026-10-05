import { supabaseClient } from "#/lib/supabaseClient";

// NOTE - this is based on the edge func schema
type DashboardRequest = {
    from: string;
    to: string;
};

export async function getDashboardData(input: DashboardRequest) {
    const { data, error } = await supabaseClient.functions.invoke(
        "dashboard-data",
        {
            body: input,
        },
    );

    if (error) {
        throw error;
    }

    return data;
}

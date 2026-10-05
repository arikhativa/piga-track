import { supabaseClient } from "#/lib/supabaseClient";

// NOTE - this is based on the edge func schema
type DashboardRequest = {
    from: string;
    to: string;
};

// NOTE - this is based on the edge func schema
type DashboardResponse = {
    balance: number;
    income: number;
    expenses: number;
    incomeCategories: {
        categoryId: number;
        category: string;
        amount: number;
    }[];
    expenseCategories: {
        categoryId: number;
        category: string;
        amount: number;
    }[];
};

export async function getDashboardData(
    input: DashboardRequest,
): Promise<DashboardResponse> {
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

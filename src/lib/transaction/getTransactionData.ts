import { supabaseClient } from "#/lib/supabaseClient";

// NOTE - this is based on the edge func schema
export type TransactionDataRequest = {
    dateRange: {
        from: string;
        to: string;
    };
    bucket: "none" | "calendar_month";
    category_list: number[];
    tag_list: number[];
    project_list: number[];
};

// NOTE - this is based on the edge func schema
type TransactionDataResponse = {
    total: number;
    buckets: {
        bucket: string;
        amount: number;
        type: "income" | "expense";
    }[];
};

export async function getTransactionData(
    input: TransactionDataRequest,
): Promise<TransactionDataResponse> {
    const { data, error } = await supabaseClient.functions.invoke(
        "get-transaction-data",
        {
            body: input,
        },
    );

    if (error) {
        throw error;
    }

    return data;
}

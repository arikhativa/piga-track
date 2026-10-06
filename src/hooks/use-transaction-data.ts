import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "#/hooks/use-dashboard-date-range";
import { getTransactionData } from "#/lib/transaction/getTransactionData";

// NOTE - this is based on the edge func schema
type UseTransactionDataOptions = {
    dateRange: DateRange;
    bucket: "none" | "calendar_month";
    category_list?: number[];
    tag_list?: number[];
    project_list?: number[];
    enabled?: boolean;
};

export function useTransactionData({
    dateRange,
    enabled,
    bucket,
    category_list = [],
    tag_list = [],
    project_list = [],
}: UseTransactionDataOptions) {
    return useQuery({
        queryKey: [
            "transaction-data",
            dateRange.from.getTime(),
            dateRange.to.getTime(),
            bucket,
            category_list,
            tag_list,
            project_list,
        ],

        queryFn: () =>
            getTransactionData({
                dateRange: {
                    from: dateRange.from.toISOString(),
                    to: dateRange.to.toISOString(),
                },
                bucket,
                category_list,
                tag_list,
                project_list,
            }),

        enabled,
    });
}

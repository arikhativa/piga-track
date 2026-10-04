import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "#/hooks/use-dashboard-date-range";
import { getBalance } from "#/lib/dashboard/getBalance";

export function useDashboardBalance(dateRange: DateRange) {
    return useQuery({
        queryKey: [
            "dashboard",
            "balance",
            dateRange.from.getTime(),
            dateRange.to.getTime(),
        ],
        queryFn: () => getBalance(dateRange),
    });
}

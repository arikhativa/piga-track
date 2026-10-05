import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "#/hooks/use-dashboard-date-range";
import { getDashboardData } from "#/lib/dashboard/getDashboardData";

export function useDashboardData(dateRange: DateRange) {
    return useQuery({
        queryKey: [
            "dashboard",
            "data",
            dateRange.from.getTime(),
            dateRange.to.getTime(),
        ],
        queryFn: () =>
            getDashboardData({
                from: dateRange.from.toISOString(),
                to: dateRange.to.toISOString(),
            }),
    });
}

import { parseAsString, useQueryStates } from "nuqs";

const dateParams = {
    from: parseAsString,
    to: parseAsString,
};

export type DateRange = {
    from: Date;
    to: Date;
};

const toDate = (value: string, endOfDay = false) => {
    const [day, month, year] = value.split("-").map(Number);

    return new Date(
        year,
        month - 1,
        day,
        endOfDay ? 23 : 0,
        endOfDay ? 59 : 0,
        endOfDay ? 59 : 0,
        endOfDay ? 999 : 0,
    );
};

const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

export function useDashboardDateRange(): [
    DateRange,
    (range: DateRange) => void,
] {
    const [{ from, to }, setDateParams] = useQueryStates(dateParams);

    const now = new Date();

    const defaultRange: DateRange = {
        from: new Date(now.getFullYear(), now.getMonth() - 1, 9),
        to: new Date(
            now.getFullYear(),
            now.getMonth(),
            8,
            23,
            59,
            59,
            999,
        ),
    };

    const dateRange: DateRange = {
        from: from ? toDate(from) : defaultRange.from,
        to: to ? toDate(to, true) : defaultRange.to,
    };

    const setDateRange = (range: DateRange) => {
        setDateParams({
            from: formatDate(range.from),
            to: formatDate(range.to),
        });
    };

    return [dateRange, setDateRange];
}

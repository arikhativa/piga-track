import { useGetList } from "ra-core";
import type { ImportBatch } from "#/db/schema";
import { toSmallDate } from "#/lib/format/toSmallDate";

export function ImportBatchDateRange({ id }: { id: ImportBatch["id"] }) {
	const { data: rows = [] } = useGetList("import_row", {
		filter: { import_batch_id: id },
		pagination: { page: 1, perPage: 1000 },
	});

	const dates = rows
		.map((row) => row.date)
		.filter((date): date is string => Boolean(date))
		.sort();

	const maxDate = dates.at(-1);
	const minDate = dates[0];

	if (!maxDate || !maxDate) {
		console.error("ImportBatchDateRange: failed to find dates");
		return "";
	}

	return `${toSmallDate(minDate)} - ${toSmallDate(maxDate)}`;
}

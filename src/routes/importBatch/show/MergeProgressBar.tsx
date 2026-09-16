import { cn } from "cn";
import { useGetList, useRecordContext } from "ra-core";
import type { ImportBatch, ImportRow, ImportRowStatusEnum } from "#/db/schema";

type ImportRowStatusCounts = Record<ImportRowStatusEnum, number>;

export function MergeProgressBar({ className }: { className?: string }) {
	const record = useRecordContext<ImportBatch>();

	const { data: rows = [], isPending } = useGetList<ImportRow>(
		"import_row",
		{
			filter: {
				import_batch_id: record?.id,
			},
			pagination: {
				page: 1,
				perPage: 1000,
			},
			sort: {
				field: "row_number",
				order: "ASC",
			},
		},
		{
			enabled: !!record?.id,
		},
	);

	if (!record || isPending) {
		return null;
	}

	const counts = rows.reduce<ImportRowStatusCounts>(
		(acc, row) => {
			acc[row.status]++;
			return acc;
		},
		{
			pending: 0,
			merged: 0,
			dropped: 0,
		},
	);

	const total = counts.pending + counts.merged + counts.dropped;

	if (total === 0) {
		return null;
	}

	const mergedPercent = (counts.merged / total) * 100;
	const droppedPercent = (counts.dropped / total) * 100;
	const pendingPercent = 100 - mergedPercent - droppedPercent;

	return (
		<div
			className={cn(
				"flex h-2 w-full overflow-hidden rounded-full bg-muted",
				className,
			)}
		>
			<div className="bg-green-500" style={{ width: `${mergedPercent}%` }} />
			<div className="bg-red-500" style={{ width: `${droppedPercent}%` }} />
			<div className="" style={{ width: `${pendingPercent}%` }} />
		</div>
	);
}

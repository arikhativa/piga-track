import type { ImportRow, Profile } from "@piga/db/types";
import { useListContext, useNotify, useRefresh } from "ra-core";
import { useEffect, useRef, useState } from "react";
import { importRowAction } from "#/lib/importer/importRowAction";

export function useOptimisticMerge(profileId: Profile["id"] | undefined) {
	const refresh = useRefresh();
	const notify = useNotify();
	const { data: rows } = useListContext<ImportRow>();
	const [optimisticMerges, setOptimisticMerges] = useState<
		Record<number, { transactionId: number | null }>
	>({});
	const mergingRowIds = useRef(new Set<number>());

	useEffect(() => {
		const settledIds = Object.keys(optimisticMerges)
			.map(Number)
			.filter((id) => {
				const merge = optimisticMerges[id];
				const row = rows?.find((row) => row.id === id);
				return (
					merge.transactionId !== null &&
					rows !== undefined &&
					(!row ||
						(row.status === "merged" &&
							row.transaction_id === merge.transactionId))
				);
			});
		if (settledIds.length === 0) return;
		setOptimisticMerges((current) => {
			const next = { ...current };
			for (const id of settledIds) delete next[id];
			return next;
		});
	}, [rows, optimisticMerges]);

	const mergeRow = async (record: ImportRow) => {
		if (mergingRowIds.current.has(record.id) || !profileId) return;
		mergingRowIds.current.add(record.id);
		setOptimisticMerges((current) => ({
			...current,
			[record.id]: { transactionId: null },
		}));

		try {
			const response = await importRowAction({
				profileId,
				import_row_ids: [record.id],
				action: "merge",
			});
			const transactionId = response.data.rows[0]?.id;
			if (response.data.action !== "merge" || transactionId == null) {
				throw new Error("Merge response did not include a transaction ID");
			}
			setOptimisticMerges((current) => ({
				...current,
				[record.id]: { transactionId },
			}));
		} catch {
			setOptimisticMerges((current) => {
				const next = { ...current };
				delete next[record.id];
				return next;
			});
			notify(
				"Could not confirm the merge. Refresh to check the row before retrying.",
				{
					type: "error",
				},
			);
		} finally {
			mergingRowIds.current.delete(record.id);
			refresh();
		}
	};

	const displayedRows = rows?.map((row) => {
		const merge = optimisticMerges[row.id];
		return merge
			? {
					...row,
					status: "merged" as const,
					transaction_id: merge.transactionId,
				}
			: row;
	});
	const hasOptimisticMerges = Object.keys(optimisticMerges).length > 0;

	return { displayedRows, optimisticMerges, hasOptimisticMerges, mergeRow };
}

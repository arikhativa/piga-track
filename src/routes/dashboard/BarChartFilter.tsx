import { useGetList } from "ra-core";
import { useState } from "react";
import { BarChartSingle } from "#/components/charts/BarChartSingle";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";
import type { TransactionCategory } from "#/db/schema";
import type { DateRange } from "#/hooks/use-dashboard-date-range";
import { useTransactionData } from "#/hooks/use-transaction-data";

export function BarChartFilter({ dateRange }: { dateRange: DateRange }) {
	const [categoryId, setCategoryId] = useState<number | undefined>();

	const { data: categories = [], isPending: isCategoriesPending } =
		useGetList<TransactionCategory>("transaction_category", {
			pagination: {
				page: 1,
				perPage: 1000,
			},
			sort: {
				field: "value",
				order: "ASC",
			},
		});

	const transactionDateRange = {
		from: new Date(
			dateRange.from.getFullYear(),
			dateRange.from.getMonth() - 5,
			dateRange.from.getDate(),
		),
		to: dateRange.to,
	};

	const { data } = useTransactionData({
		dateRange: transactionDateRange,
		bucket: "billing_month",
		category_list: categoryId ? [categoryId] : [],
		enabled: !!categoryId,
	});

	return (
		<div className="pt-10 flex flex-col gap-4">
			<h2 className="font-semibold text-2xl">Compare by category</h2>
			<DynamicSelect
				choices={categories}
				optionText="value"
				emptyText="Category"
				isPending={isCategoriesPending}
				onChange={(value) => {
					setCategoryId(value ? Number(value) : undefined);
				}}
			/>

			<BarChartSingle
				data={
					data?.buckets.map((bucket) => ({
						...bucket,
						amount: Math.abs(bucket.amount),
					})) || []
				}
				title=""
			/>
		</div>
	);
}

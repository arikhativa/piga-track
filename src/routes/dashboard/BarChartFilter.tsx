import { useGetList } from "ra-core";
import { useMemo, useState } from "react";
import { BarChartMultiple } from "#/components/charts/BarChartMultiple";
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

	const transactionDateRange = useMemo(
		() => ({
			from: new Date(
				dateRange.from.getFullYear(),
				dateRange.from.getMonth() - 5,
				dateRange.from.getDate(),
			),
			to: dateRange.to,
		}),
		[dateRange],
	);

	const { data } = useTransactionData({
		dateRange: transactionDateRange,
		bucket: "calendar_month",
		category_list: categoryId ? [categoryId] : [],
		enabled: !!categoryId,
	});

	const buckets = data?.buckets ?? [];

	const hasIncome = buckets.some((bucket) => bucket.type === "income");
	const hasExpense = buckets.some((bucket) => bucket.type === "expense");

	const isMultiple = hasIncome && hasExpense;

	const singleData = buckets.map((bucket) => ({
		bucket: bucket.bucket,
		amount: Math.abs(bucket.amount),
	}));

	const multipleData = Object.values(
		buckets.reduce<
			Record<
				string,
				{
					month: string;
					income: number;
					expenses: number;
				}
			>
		>((result, bucket) => {
			const current = result[bucket.bucket] ?? {
				month: bucket.bucket,
				income: 0,
				expenses: 0,
			};

			if (bucket.type === "income") {
				current.income = Math.abs(bucket.amount);
			}

			if (bucket.type === "expense") {
				current.expenses = Math.abs(bucket.amount);
			}

			result[bucket.bucket] = current;

			return result;
		}, {}),
	);

	return (
		<div className="space-y-4">
			<DynamicSelect
				className="max-w-lg"
				choices={categories}
				optionText="value"
				value={categoryId}
				emptyText="Category"
				isPending={isCategoriesPending}
				onChange={(value) => {
					setCategoryId(value ? Number(value) : undefined);
				}}
			/>

			{isMultiple ? (
				<BarChartMultiple data={multipleData} />
			) : (
				<BarChartSingle data={singleData} title="" />
			)}
		</div>
	);
}

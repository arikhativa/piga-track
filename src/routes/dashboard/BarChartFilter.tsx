import { parseAsInteger, useQueryStates } from "nuqs";
import { useGetList } from "ra-core";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BarChartMultiple } from "#/components/charts/BarChartMultiple";
import { BarChartSingle } from "#/components/charts/BarChartSingle";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";
import type { TransactionCategory, TransactionTag } from "#/db/schema";
import type { DateRange } from "#/hooks/use-dashboard-date-range";
import { useTransactionData } from "#/hooks/use-transaction-data";

type FilterType = "category" | "tag";

type BarChartFilterProps = {
	dateRange: DateRange;
	filterType: FilterType;
};

const selectionParsers = {
	categoryId: parseAsInteger,
	tagId: parseAsInteger,
};

export function BarChartFilter({ dateRange, filterType }: BarChartFilterProps) {
	const isCategory = filterType === "category";
	const extraFilter = isCategory ? "category_id" : "tag_id";

	const [queryState, setQueryState] = useQueryStates(selectionParsers);

	const selectedId = isCategory ? queryState.categoryId : queryState.tagId;

	const { data: categories = [], isPending: isCategoriesPending } =
		useGetList<TransactionCategory>("transaction_category", {
			pagination: { page: 1, perPage: 1000 },
			sort: { field: "value", order: "ASC" },
		});

	const { data: tags = [], isPending: isTagsPending } =
		useGetList<TransactionTag>("transaction_tag", {
			pagination: { page: 1, perPage: 1000 },
			sort: { field: "value", order: "ASC" },
		});

	const choices = isCategory ? categories : tags;
	const isChoicesPending = isCategory ? isCategoriesPending : isTagsPending;

	const transactionDateRange = useMemo(
		() => ({
			from: new Date(
				dateRange.from.getFullYear(),
				dateRange.from.getMonth() - 5,
				dateRange.from.getDate(),
			),
			to: dateRange.to,
		}),
		[dateRange.from, dateRange.to],
	);

	const { data } = useTransactionData({
		dateRange: transactionDateRange,
		bucket: "calendar_month",
		category_list: isCategory && selectedId !== null ? [selectedId] : [],
		tag_list: !isCategory && selectedId !== null ? [selectedId] : [],
		enabled: selectedId !== null,
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
			Record<string, { month: string; income: number; expenses: number }>
		>((result, bucket) => {
			const current = result[bucket.bucket] ?? {
				month: bucket.bucket,
				income: 0,
				expenses: 0,
			};

			if (bucket.type === "income") {
				current.income += Math.abs(bucket.amount);
			}

			if (bucket.type === "expense") {
				current.expenses += Math.abs(bucket.amount);
			}

			result[bucket.bucket] = current;
			return result;
		}, {}),
	);

	const navigate = useNavigate();

	const handleBarClick = (bucket: string) => {
		if (selectedId === null) return;

		const [year, month] = bucket.split("-").map(Number);
		const monthString = String(month).padStart(2, "0");
		const from = `${year}-${monthString}-01`;
		const lastDay = new Date(year, month, 0).getDate();
		const to = `${year}-${monthString}-${String(lastDay).padStart(2, "0")}`;

		const filter = {
			"transaction_at@gte": from,
			"transaction_at@lte": to,
			[extraFilter]: String(selectedId),
		};

		const displayedFilters = {
			"transaction_at@gte": true,
			"transaction_at@lte": true,
			[extraFilter]: true,
		};

		const params = new URLSearchParams({
			displayedFilters: JSON.stringify(displayedFilters),
			filter: JSON.stringify(filter),
			order: "DESC",
			page: "1",
			perPage: "50",
			sort: "transaction_at",
		});

		navigate(`/transaction?${params.toString()}`);
	};

	return (
		<>
			<DynamicSelect
				className="max-w-lg"
				choices={choices}
				optionText="value"
				value={selectedId ?? undefined}
				emptyText={isCategory ? "Category" : "Tag"}
				isPending={isChoicesPending}
				onChange={(value) => {
					const id = value ? Number(value) : null;

					void setQueryState({
						[isCategory ? "categoryId" : "tagId"]: id,
					});
				}}
			/>

			{isMultiple ? (
				<BarChartMultiple data={multipleData} />
			) : (
				<BarChartSingle
					data={singleData}
					title=""
					onBarClick={handleBarClick}
				/>
			)}
		</>
	);
}

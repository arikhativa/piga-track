import { parseAsInteger, useQueryStates } from "nuqs";

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BarChartMultiple } from "#/components/charts/BarChartMultiple";
import { BarChartSingle } from "#/components/charts/BarChartSingle";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";
import { useCategoryList } from "#/hooks/use-category-list";
import type { DateRange } from "#/hooks/use-dashboard-date-range";
import { useTransactionData } from "#/hooks/use-transaction-data";

type BarChartFilterProps = {
	dateRange: DateRange;
};

const selectionParsers = {
	categoryId: parseAsInteger,
	subCategoryId: parseAsInteger,
};

export function BarChartFilter({ dateRange }: BarChartFilterProps) {
	const [queryState, setQueryState] = useQueryStates(selectionParsers);

	const subCategoryId = queryState.subCategoryId;
	const categoryId =
		subCategoryId !== null ? null : (queryState.categoryId ?? 1);
	const selectedId = subCategoryId ?? categoryId;
	const categoryFilter =
		subCategoryId !== null ? "sub_category_id" : "category_id";

	const { data: categories = [], isPending: isCategoriesPending } =
		useCategoryList();

	const parentCategories = categories.filter(
		(category) => category.parent_id === null,
	);
	const subCategories = categories.filter(
		(category) => category.parent_id !== null,
	);

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
		category_list: categoryId !== null ? [categoryId] : [],
		sub_category_list: subCategoryId !== null ? [subCategoryId] : [],
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
			[categoryFilter]: String(selectedId),
		};

		const displayedFilters = {
			"transaction_at@gte": true,
			"transaction_at@lte": true,
			[categoryFilter]: true,
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
				choices={parentCategories}
				optionText="value"
				emptyText="Category"
				value={categoryId}
				isPending={isCategoriesPending}
				onChange={(value) => {
					const id = value ? Number(value) : null;

					void setQueryState({
						categoryId: id,
						subCategoryId: null,
					});
				}}
			/>

			<DynamicSelect
				className="max-w-lg"
				choices={subCategories}
				optionText="value"
				emptyText="Sub category"
				value={subCategoryId}
				isPending={isCategoriesPending}
				onChange={(value) => {
					void setQueryState({
						categoryId: null,
						subCategoryId: value ? Number(value) : null,
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

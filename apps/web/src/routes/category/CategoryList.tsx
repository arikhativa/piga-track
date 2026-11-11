import type { TransactionCategory } from "@piga/db/types";
import { useListContext } from "ra-core";
import { useEffect, useMemo } from "react";
import { Spinner } from "#/components/admin/spinner";
import { BooleanField, DataTable, List } from "@/components/admin";

type CategoryRow = TransactionCategory & { depth: number };

function orderCategories(categories: TransactionCategory[]): CategoryRow[] {
	const ids = new Set(categories.map((category) => category.id));
	const children = new Map<number | null, TransactionCategory[]>();

	for (const category of categories) {
		const parentId =
			category.parent_id != null && ids.has(category.parent_id)
				? category.parent_id
				: null;
		const siblings = children.get(parentId) ?? [];
		siblings.push(category);
		children.set(parentId, siblings);
	}

	for (const siblings of children.values()) {
		siblings.sort((a, b) => a.value.localeCompare(b.value) || a.id - b.id);
	}

	const rows: CategoryRow[] = [];
	const visited = new Set<number>();
	const visit = (category: TransactionCategory, depth: number) => {
		if (visited.has(category.id)) return;
		visited.add(category.id);
		rows.push({ ...category, depth });
		for (const child of children.get(category.id) ?? []) {
			visit(child, depth + 1);
		}
	};

	for (const root of children.get(null) ?? []) visit(root, 0);
	// Keep malformed cyclic records visible without recursing forever.
	for (const category of categories) visit(category, 0);
	return rows;
}

function CategoryTable() {
	const { data, total, perPage, setPerPage, isPending } =
		useListContext<TransactionCategory>();

	// Load the complete hierarchy before ordering; page boundaries can split branches.
	useEffect(() => {
		if (total != null && total > perPage) setPerPage(total);
	}, [total, perPage, setPerPage]);

	const rows = useMemo(() => orderCategories(data ?? []), [data]);
	if (isPending || (total != null && total > perPage)) {
		return <Spinner />;
	}

	return (
		<DataTable<CategoryRow> data={rows}>
			<DataTable.Col
				source="value"
				label="Name"
				disableSort
				render={(record) => (
					<span>
						{record.depth > 0 && (
							<span aria-hidden="true" className="text-muted-foreground">
								↳{" "}
							</span>
						)}
						{record.value}
					</span>
				)}
			/>
			<DataTable.Col
				source="is_expense"
				disableSort
				render={(record) =>
					record.parent_id == null ? <BooleanField source="is_expense" /> : null
				}
			/>
			<DataTable.Col
				source="is_income"
				disableSort
				render={(record) =>
					record.parent_id == null ? <BooleanField source="is_income" /> : null
				}
			/>
		</DataTable>
	);
}

export const CategoryList = () => (
	<List
		perPage={1000}
		pagination={false}
		disableSyncWithLocation
		storeKey={false}
		sort={{ field: "value", order: "ASC" }}
	>
		<CategoryTable />
	</List>
);

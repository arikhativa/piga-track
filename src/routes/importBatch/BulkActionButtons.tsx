import { Loader2 } from "lucide-react";
import { useGetList, useListContext, useNotify, useRefresh } from "ra-core";
import { useState } from "react";
import { SelectAllButton } from "#/components/admin";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import type {
	Profile,
	TransactionCategory,
	TransactionProject,
} from "#/db/schema";
import { importRowAction } from "#/lib/importer/importRowAction";

export function BulkActionButtons({ profileId }: { profileId: Profile["id"] }) {
	const notify = useNotify();
	const refresh = useRefresh();
	const { selectedIds, data } = useListContext();

	const [isSubmittingUndo, setIsSubmittingUndo] = useState(false);
	const [isSubmittingMerge, setIsSubmittingMerge] = useState(false);
	const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
	const [isSubmittingProject, setIsSubmittingProject] = useState(false);

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

	const { data: projects = [], isPending: isProjectsPending } =
		useGetList<TransactionProject>("transaction_project", {
			pagination: {
				page: 1,
				perPage: 1000,
			},
			sort: {
				field: "value",
				order: "ASC",
			},
		});

	const selectedIdSet = new Set(selectedIds.map(Number));

	const selectedRows = Object.values(data ?? {}).filter((row) =>
		selectedIdSet.has(Number(row.id)),
	);

	const rowsMatchSelection = selectedRows.length === selectedIds.length;

	const statuses = rowsMatchSelection
		? selectedRows.map((row) => row.status)
		: [];

	const sameStatus =
		rowsMatchSelection && statuses.length > 0 && new Set(statuses).size === 1;

	const canMerge = sameStatus && statuses[0] === "pending";
	const canUndo =
		sameStatus && (statuses[0] === "merged" || statuses[0] === "dropped");

	const canSetCategory = canMerge;
	const canSetProject = canMerge;

	const handleCategoryChange = async (value: string | number) => {
		if (!value || !canSetCategory) return;

		try {
			setIsSubmittingCategory(true);

			await importRowAction({
				import_row_ids: selectedIds as number[],
				profile_id: profileId,
				action: "set_category",
				value: Number(value),
			});

			notify(`${selectedIds.length} rows updated`, {
				type: "success",
			});

			refresh();
		} catch {
			notify("Failed to update category", {
				type: "error",
			});
		} finally {
			setIsSubmittingCategory(false);
		}
	};

	const handleProjectChange = async (value: string | number) => {
		if (!value || !canSetProject) return;

		try {
			setIsSubmittingProject(true);

			await importRowAction({
				import_row_ids: selectedIds as number[],
				profile_id: profileId,
				action: "set_project",
				value: Number(value),
			});

			notify(`${selectedIds.length} rows updated`, {
				type: "success",
			});

			refresh();
		} catch {
			notify("Failed to update project", {
				type: "error",
			});
		} finally {
			setIsSubmittingProject(false);
		}
	};

	const handleMerge = async () => {
		try {
			setIsSubmittingMerge(true);

			await importRowAction({
				import_row_ids: selectedIds as number[],
				profile_id: profileId,
				action: "merge",
			});

			notify(`${selectedIds.length} rows merged`, {
				type: "success",
			});

			refresh();
		} catch {
			notify("Failed to merge rows", {
				type: "error",
			});
		} finally {
			setIsSubmittingMerge(false);
		}
	};

	const handleUndo = async () => {
		try {
			setIsSubmittingUndo(true);

			await importRowAction({
				import_row_ids: selectedIds as number[],
				profile_id: profileId,
				action: "undo",
			});

			notify(`${selectedIds.length} rows undone`, {
				type: "success",
			});

			refresh();
		} catch {
			notify("Failed to undo rows", {
				type: "error",
			});
		} finally {
			setIsSubmittingUndo(false);
		}
	};

	return (
		<div className="flex gap-4">
			<SelectAllButton />

			{(canSetCategory || canSetProject) && (
				<>
					<Separator orientation="vertical" />

					<div className="flex gap-2">
						{canSetCategory && (
							<DynamicSelect
								disabled={isSubmittingCategory}
								choices={categories}
								optionText="value"
								emptyText="Category"
								isPending={isCategoriesPending || isSubmittingCategory}
								onChange={handleCategoryChange}
							/>
						)}

						{canSetProject && (
							<DynamicSelect
								disabled={isSubmittingProject}
								choices={projects}
								optionText="value"
								emptyText="Project"
								isPending={isProjectsPending || isSubmittingProject}
								onChange={handleProjectChange}
							/>
						)}
					</div>
				</>
			)}

			{(canMerge || canUndo) && (
				<>
					<Separator orientation="vertical" />

					<div className="flex gap-2">
						{canMerge && (
							<Button
								type="button"
								variant="default"
								disabled={isSubmittingMerge}
								onClick={handleMerge}
							>
								{isSubmittingMerge ? (
									<Loader2 className="me-2 h-4 w-4 animate-spin" />
								) : null}
								Merge
							</Button>
						)}

						{canUndo && (
							<Button
								type="button"
								variant="outline"
								disabled={isSubmittingUndo}
								onClick={handleUndo}
							>
								{isSubmittingUndo ? (
									<Loader2 className="me-2 h-4 w-4 animate-spin" />
								) : null}
								Undo
							</Button>
						)}
					</div>
				</>
			)}
		</div>
	);
}

import { Label } from "#/components/ui/label";
import { Separator } from "#/components/ui/separator";
import { ImportBatchTitle } from "#/routes/importBatch/ImportBatchTitle";
import { ImportRowDataTable } from "#/routes/importBatch/ImportRowDataTable";
import { BatchStatusInput } from "#/routes/importBatch/show/BatchStatusInput";
import { MergeAllPendingButton } from "#/routes/importBatch/show/MergeAllPendingButton";
import { MergeProgressBar } from "#/routes/importBatch/show/MergeProgressBar";
import { ReferenceManyField, Show } from "@/components/admin";

export function ImportBatchShow() {
	return (
		<Show title={<ImportBatchTitle />}>
			<article className="space-y-4">
				<div className="flex items-center gap-8">
					<div className="flex-1 flex  flex-col gap-2">
						<Label className="w-fit whitespace-nowrap">Merge Progress</Label>
						<MergeProgressBar />
					</div>

					<div className="flex items-center gap-2">
						<MergeAllPendingButton />
						<Separator orientation="vertical" />
						<BatchStatusInput />
					</div>
				</div>
				<ReferenceManyField
					sort={{ field: "row_number", order: "ASC" }}
					reference="import_row"
					target="import_batch_id"
					perPage={1000}
				>
					<ImportRowDataTable />
				</ReferenceManyField>
			</article>
		</Show>
	);
}

import { ImportRowDataTable } from "#/routes/importBatch/ImportRowDataTable";
import { ReferenceManyField, Show } from "@/components/admin";

export function ImportBatchShow() {
	return (
		<Show>
			<article className="space-y-4">
				<ReferenceManyField reference="import_row" target="import_batch_id">
					<ImportRowDataTable />
				</ReferenceManyField>
			</article>
		</Show>
	);
}

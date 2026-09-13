import { useDataProvider, useRefresh } from "ra-core";
import { useState } from "react";
import { Spinner } from "#/components/admin/spinner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import type { ImportRow } from "#/db/schema";
import { useProjectList } from "#/hooks/use-project-list";

// TODO: not sure i want this
export const ProjectCell = ({ record }: { record: ImportRow }) => {
	const [value, setValue] = useState(record.project_id?.toString() ?? "");
	const dataProvider = useDataProvider();
	const { data: projList, isPending } = useProjectList();

	const refresh = useRefresh();

	const handleChange = async (value: string | null) => {
		if (value === null) return;

		setValue(value);

		await dataProvider.update("import_row", {
			id: record.id,
			data: {
				project_id: Number(value),
			},
			previousData: record,
		});

		refresh();
	};

	if (isPending) return <Spinner />;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: this will ignore the row nav to the real element
		// biome-ignore lint/a11y/useKeyWithClickEvents: same
		<div
			onClick={(e) => e.stopPropagation()}
			onPointerDown={(e) => e.stopPropagation()}
		>
			<Select value={value} onValueChange={handleChange}>
				<SelectTrigger>
					<SelectValue placeholder="Project">
						{projList?.find((project) => project.id.toString() === value)
							?.value ?? "Project"}
					</SelectValue>
				</SelectTrigger>

				<SelectContent>
					{projList?.map((project) => (
						<SelectItem key={project.id} value={project.id.toString()}>
							{project.value}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

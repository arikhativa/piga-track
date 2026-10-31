import { ProjectForm } from "#/routes/project/ProjectForm";
import { ProjectTitle } from "#/routes/project/ProjectTitle";
import { Edit } from "@/components/admin";

export function ProjectEdit() {
	return (
		<Edit title={<ProjectTitle />}>
			<ProjectForm />
		</Edit>
	);
}

import { ProjectForm } from "#/routes/project/ProjectForm";
import { Edit } from "@/components/admin";

export function ProjectEdit() {
	return (
		<Edit>
			<ProjectForm />
		</Edit>
	);
}

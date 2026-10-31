import { ProjectForm } from "#/routes/project/ProjectForm";
import { Create } from "@/components/admin";

export function ProjectCreate() {
	return (
		<Create redirect={"list"}>
			<ProjectForm />
		</Create>
	);
}

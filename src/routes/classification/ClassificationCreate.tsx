import { ClassificationForm } from "#/routes/classification/ClassificationForm";
import { Create } from "@/components/admin";

export function ClassificationCreate() {
	return (
		<Create redirect={"list"}>
			<ClassificationForm />
		</Create>
	);
}

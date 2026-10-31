import { ImportProfileForm } from "#/routes/importProfile/ImportProfileForm";
import { Create } from "@/components/admin";

export function ImportProfileCreate() {
	return (
		<Create>
			<ImportProfileForm />
		</Create>
	);
}

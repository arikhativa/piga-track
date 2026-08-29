import { PotForm } from "#/routes/pot/PotForm";
import { Create } from "@/components/admin";

export function PotCreate() {
	return (
		<Create redirect={"list"}>
			<PotForm />
		</Create>
	);
}

import { CategoryForm } from "#/routes/category/CategoryForm";
import { Create } from "@/components/admin";

export function CategoryCreate() {
	return (
		<Create redirect={"list"}>
			<CategoryForm />
		</Create>
	);
}

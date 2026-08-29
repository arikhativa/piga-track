import { CurrencyForm } from "#/routes/currency/CurrencyForm";
import { Create } from "@/components/admin";

export function CurrencyCreate() {
	return (
		<Create redirect={"list"}>
			<CurrencyForm />
		</Create>
	);
}

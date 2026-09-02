import { TransactionDataTable } from "#/routes/(transaction)/TransactionDataTable";
import { List } from "@/components/admin";

export const TransactionList = () => {
	return (
		<List sort={{ field: "created_at", order: "DESC" }}>
			<TransactionDataTable colToHide={["tag"]} />
		</List>
	);
};

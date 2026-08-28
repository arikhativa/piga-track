import { createFileRoute } from "@tanstack/react-router";
import { Coins, Tags } from "lucide-react";
import { Resource } from "ra-core";
import { Admin } from "#/components/admin";
import { supabaseAuthProvider } from "#/lib/authProvider";
import { supabaseDataProvider } from "#/lib/dataProvider";
import { getIdentity } from "#/lib/getIdentity";
import { supabaseClient } from "#/lib/supabaseClient";
import { TransactionCreate } from "#/routes/(transaction)/-TransactionCreate";
import { TransactionEdit } from "#/routes/(transaction)/-TransactionEdit";
import { TransactionList } from "#/routes/(transaction)/-TransactionList";
import { TransactionShow } from "#/routes/(transaction)/-TransactionShow";
import { TransactionTagCreate } from "#/routes/(transactionTag)/-TransactionTagCreate";
import { TransactionTagEdit } from "#/routes/(transactionTag)/-TransactionTagEdit";
import { TransactionTagList } from "#/routes/(transactionTag)/-TransactionTagList";

const instanceUrl = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;

const dataProvider = supabaseDataProvider({
	instanceUrl,
	apiKey,
	supabaseClient,
});

const authProvider = supabaseAuthProvider(supabaseClient, { getIdentity });

export const Route = createFileRoute("/")({ component: Home });
function Home() {
	return (
		<Admin authProvider={authProvider} dataProvider={dataProvider}>
			<Resource
				name="transaction"
				list={TransactionList}
				edit={TransactionEdit}
				show={TransactionShow}
				create={TransactionCreate}
				icon={Coins}
			/>
			<Resource
				name="transaction_tag"
				options={{ label: "Tags" }}
				list={TransactionTagList}
				edit={TransactionTagEdit}
				create={TransactionTagCreate}
				icon={Tags}
			/>
		</Admin>
	);
}

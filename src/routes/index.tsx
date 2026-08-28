import { createFileRoute } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import { Resource } from "ra-core";
import {
	Admin,
	EditGuesser,
	ListGuesser,
	ShowGuesser,
} from "#/components/admin";
import { supabaseAuthProvider } from "#/lib/authProvider";
import { supabaseDataProvider } from "#/lib/dataProvider";
import { getIdentity } from "#/lib/getIdentity";
import { supabaseClient } from "#/lib/supabaseClient";
import { TransactionCreate } from "#/routes/(transaction)/-TransactionCreate";

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
				list={ListGuesser}
				edit={EditGuesser}
				show={ShowGuesser}
				create={TransactionCreate}
				icon={Coins}
			/>
		</Admin>
	);
}

import { Coins, Tags } from "lucide-react";
import { CustomRoutes, Resource } from "ra-core";
import { Route } from "react-router-dom";
import { Admin } from "#/components/admin";
import { TooltipProvider } from "#/components/ui/tooltip";
import { supabaseAuthProvider } from "#/lib/authProvider";
import { supabaseDataProvider } from "#/lib/dataProvider";
import { getIdentity } from "#/lib/getIdentity";
import { supabaseClient } from "#/lib/supabaseClient";
import { TransactionCreate } from "#/routes/(transaction)/-TransactionCreate";
import { TransactionEdit } from "#/routes/(transaction)/-TransactionEdit";
import { TransactionList } from "#/routes/(transaction)/-TransactionList";
import { TransactionTagCreate } from "#/routes/(transactionTag)/-TransactionTagCreate";
import { TransactionTagEdit } from "#/routes/(transactionTag)/-TransactionTagEdit";
import { TransactionTagList } from "#/routes/(transactionTag)/-TransactionTagList";

import "../styles.css";
import { Dashboard } from "#/routes/dashboard/Dashboard";

const instanceUrl = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;

const dataProvider = supabaseDataProvider({
	instanceUrl,
	apiKey,
	supabaseClient,
});

const authProvider = supabaseAuthProvider(supabaseClient, { getIdentity });

export function App() {
	return (
		<TooltipProvider>
			<Admin authProvider={authProvider} dataProvider={dataProvider}>
				<CustomRoutes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</CustomRoutes>
				<Resource
					name="transaction"
					list={TransactionList}
					edit={TransactionEdit}
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
		</TooltipProvider>
	);
}

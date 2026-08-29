import { ChartGantt, Coins, HandCoins, PiggyBank, Tags } from "lucide-react";
import { CustomRoutes, Resource } from "ra-core";
import { Navigate, Route } from "react-router-dom";
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
import { CurrencyCreate } from "#/routes/currency/CurrencyCreate";
import { CurrencyEdit } from "#/routes/currency/CurrencyEdit";
import { CurrencyList } from "#/routes/currency/CurrencyList";
import { Dashboard } from "#/routes/dashboard/Dashboard";
import { DefaultsBaseEdit } from "#/routes/defaults/DefaultsBaseEdit";
import { PotCreate } from "#/routes/pot/PotCreate";
import { PotEdit } from "#/routes/pot/PotEdit";
import { PotList } from "#/routes/pot/PotList";
import { ProfileBaseEdit } from "#/routes/profile/ProfileBaseEdit";
import { ProjectCreate } from "#/routes/project/ProjectCreate";
import { ProjectEdit } from "#/routes/project/ProjectEdit";
import { ProjectList } from "#/routes/project/ProjectList";

const instanceUrl = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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
					<Route
						path="/"
						element={<Navigate to="/transaction/create" replace />}
					/>
					<Route path="/profile" element={<ProfileBaseEdit />} />
					<Route path="/defaults" element={<DefaultsBaseEdit />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</CustomRoutes>

				{/* Tables */}
				<Resource
					name="transaction"
					list={TransactionList}
					edit={TransactionEdit}
					create={TransactionCreate}
					options={{ table: true }}
					icon={HandCoins}
				/>
				<Resource
					name="transaction_type"
					options={{ label: "Money pots", table: true }}
					list={PotList}
					edit={PotEdit}
					create={PotCreate}
					icon={PiggyBank}
				/>
				<Resource
					name="transaction_project"
					options={{ label: "Projects", table: true }}
					list={ProjectList}
					edit={ProjectEdit}
					create={ProjectCreate}
					icon={ChartGantt}
				/>

				{/* Utils */}
				<Resource
					name="transaction_tag"
					options={{ label: "Tags", util: true }}
					list={TransactionTagList}
					edit={TransactionTagEdit}
					create={TransactionTagCreate}
					icon={Tags}
				/>
				<Resource
					name="currency"
					options={{ util: true }}
					list={CurrencyList}
					edit={CurrencyEdit}
					create={CurrencyCreate}
					icon={Coins}
				/>
			</Admin>
		</TooltipProvider>
	);
}

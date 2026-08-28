import { required } from "ra-core";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { useProfile } from "#/hooks/use-profile";
import { Create, SimpleForm, TextInput } from "@/components/admin";

export function TransactionCreate() {
	const profile = useProfile();
	const [type, setType] = useState<"spent" | "received">("spent");

	return (
		<Create
			transform={(data) => {
				const amount = Math.abs(Number(data.amount));

				return {
					...data,
					profileId: profile?.id,
					amount: data.received ? amount : -amount,
				};
			}}
		>
			<SimpleForm>
				<Tabs
					value={type}
					onValueChange={(value) => setType(value as typeof type)}
				>
					<TabsList>
						<TabsTrigger value="spent">Spent</TabsTrigger>
						<TabsTrigger value="received">Received</TabsTrigger>
					</TabsList>
				</Tabs>

				<TextInput
					source="amount"
					label="Amount"
					type="number"
					validate={required()}
				/>

				<TextInput
					source="description"
					label="Description"
					multiline
					validate={required()}
				/>
			</SimpleForm>
		</Create>
	);
}

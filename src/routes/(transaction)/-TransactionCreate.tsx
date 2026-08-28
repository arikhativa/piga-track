import { required } from "ra-core";
import { useState } from "react";
import { SpentReceivedTabs } from "#/components/custom-ui/SpentReceivedTabs";
import { useProfile } from "#/hooks/use-profile";
import { Create, SimpleForm, TextInput } from "@/components/admin";

export function TransactionCreate() {
	const profile = useProfile();
	const [type, setType] = useState<"spent" | "received">("spent");

	return (
		<Create
			transform={(data) => {
				const amount = type === "received" ? data.amount : -data.amount;

				return {
					...data,
					profile_id: profile?.id,
					amount,
				};
			}}
		>
			<SimpleForm>
				<SpentReceivedTabs type={type} setType={setType} />

				<TextInput
					source="amount"
					label="Amount"
					type="number"
					validate={required()}
				/>

				<TextInput source="description" label="Description" multiline />
			</SimpleForm>
		</Create>
	);
}

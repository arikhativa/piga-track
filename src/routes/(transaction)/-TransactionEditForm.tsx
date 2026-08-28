import { required, useRecordContext } from "ra-core";
import { useEffect } from "react";
import {
	SpentReceivedTabs,
	type SpentReceivedTabsProps,
} from "#/components/custom-ui/SpentReceivedTabs";
import { NumberInput, SimpleForm, TextInput } from "@/components/admin";

export function TransactionEditForm({ type, setType }: SpentReceivedTabsProps) {
	const record = useRecordContext();

	// biome-ignore lint/correctness/useExhaustiveDependencies: this should run on init only
	useEffect(() => {
		setType(record?.amount < 0 ? "spent" : "received");
	}, []);

	return (
		<SimpleForm>
			<SpentReceivedTabs type={type} setType={setType} />

			<NumberInput
				source="amount"
				label="Amount"
				type="number"
				validate={required()}
				format={(value) => Math.abs(Number(value))}
			/>

			<TextInput source="description" label="Description" multiline />
		</SimpleForm>
	);
}

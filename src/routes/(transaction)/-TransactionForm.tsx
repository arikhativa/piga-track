import { required, useRecordContext } from "ra-core";
import { useEffect } from "react";
import {
	SpentReceivedTabs,
	type SpentReceivedTabsProps,
} from "#/components/custom-ui/SpentReceivedTabs";
import {
	DateInput,
	NumberInput,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
} from "@/components/admin";

export function TransactionForm({ type, setType }: SpentReceivedTabsProps) {
	const record = useRecordContext();

	// biome-ignore lint/correctness/useExhaustiveDependencies: this should run on init only
	useEffect(() => {
		setType(record?.amount < 0 ? "spent" : "received");
	}, []);

	return (
		<SimpleForm>
			<SpentReceivedTabs type={type} setType={setType} />
			<ReferenceInput source="tag_id" reference="transaction_tag">
				<SelectInput label="Tag" optionText="value" emptyText="No tag" />
			</ReferenceInput>
			<NumberInput
				source="amount"
				label="Amount"
				type="number"
				validate={required()}
				format={(value) => Math.abs(Number(value))}
			/>
			<DateInput source="created_at" />
			<TextInput source="description" label="Description" multiline />
		</SimpleForm>
	);
}

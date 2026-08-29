import { required, useRecordContext } from "ra-core";
import { useEffect } from "react";
import {
	SpentReceivedTabs,
	type SpentReceivedTabsProps,
} from "#/components/custom-ui/SpentReceivedTabs";
import { DynamicSelect } from "#/components/form/DynamicSelect";
import { useProfile } from "#/hooks/use-profile";
import { currencyOptionText } from "#/lib/form/currencyOptionText";
import { projectOptionText } from "#/lib/form/projectOptionText";
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
	const { data: profile } = useProfile();

	// biome-ignore lint/correctness/useExhaustiveDependencies: this should run on init only
	useEffect(() => {
		setType(record?.amount > 0 ? "received" : "spent");
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
			<ReferenceInput source="category_id" reference="transaction_category">
				<DynamicSelect label="Category" optionText="value" />
			</ReferenceInput>

			<ReferenceInput source="tag_id" reference="transaction_tag">
				<DynamicSelect label="Tag" optionText="value" />
			</ReferenceInput>

			<DateInput
				source="created_at"
				defaultValue={new Date().toISOString()}
				validate={required()}
			/>

			<ReferenceInput source="currency_id" reference="currency">
				<SelectInput
					defaultValue={profile?.default_currency_id}
					label="Currency"
					optionText={currencyOptionText}
					validate={required()}
				/>
			</ReferenceInput>

			<ReferenceInput source="transaction_type_id" reference="transaction_type">
				<SelectInput
					defaultValue={profile?.default_transaction_type_id}
					label="Type"
					validate={required()}
				/>
			</ReferenceInput>

			<ReferenceInput source="project_id" reference="transaction_project">
				<SelectInput
					defaultValue={profile?.default_project_id || ""}
					optionText={projectOptionText}
					label="Project"
				/>
			</ReferenceInput>
			<TextInput source="description" label="Description" multiline />
		</SimpleForm>
	);
}

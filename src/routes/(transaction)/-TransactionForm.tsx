import { required, useRecordContext } from "ra-core";
import { useEffect } from "react";
import {
	SpentReceivedTabs,
	type SpentReceivedTabsProps,
} from "#/components/custom-ui/SpentReceivedTabs";
import { DynamicSelect } from "#/components/form/DynamicSelect";
import { Separator } from "#/components/ui/separator";
import { useProfile } from "#/hooks/use-profile";
import { currencyOptionText } from "#/lib/form/currencyOptionText";
import { projectOptionText } from "#/lib/form/projectOptionText";
import {
	DateTimeInput,
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
			<div className="flex justify-center items-end gap-4">
				<SpentReceivedTabs type={type} setType={setType} />
				<NumberInput
					className="flex-1"
					source="amount"
					label="Amount"
					type="number"
					validate={required()}
					format={(value) => Math.abs(Number(value))}
				/>
			</div>

			<Separator />

			<div className="grid grid-cols-2 gap-4">
				<ReferenceInput source="tag_id" reference="transaction_tag">
					<DynamicSelect label="Content" optionText="value" />
				</ReferenceInput>

				<ReferenceInput source="category_id" reference="transaction_category">
					<DynamicSelect
						defaultValue={profile?.default_category_id}
						label="Category"
						optionText="value"
					/>
				</ReferenceInput>

				<ReferenceInput source="project_id" reference="transaction_project">
					<SelectInput
						defaultValue={profile?.default_project_id ?? undefined}
						optionText={projectOptionText}
						label="Project"
					/>
				</ReferenceInput>
				<ReferenceInput source="profile_id" reference="profile">
					<SelectInput
						label="Owner"
						defaultValue={profile?.id}
						optionText={(profile) =>
							`${profile.first_name} ${profile.last_name}`
						}
						validate={required()}
					/>
				</ReferenceInput>
			</div>

			<Separator />

			<div className="grid grid-cols-2 gap-4">
				<DateTimeInput
					className=" col-span-2"
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
				<ReferenceInput
					source="transaction_type_id"
					reference="transaction_type"
				>
					<SelectInput
						defaultValue={profile?.default_transaction_type_id}
						label="Type"
						validate={required()}
					/>
				</ReferenceInput>
			</div>

			<Separator />

			<TextInput source="description" label="Description" multiline />
		</SimpleForm>
	);
}

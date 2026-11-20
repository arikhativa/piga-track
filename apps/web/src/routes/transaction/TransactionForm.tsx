import { required } from "ra-core";
import { useMemo } from "react";
import { Spinner } from "#/components/admin/spinner";
import {
	SpentReceivedTabs,
	type SpentReceivedTabsProps,
} from "#/components/custom-ui/SpentReceivedTabs";
import {
	DynamicCategorySelectInput,
	DynamicChildCategorySelectInput,
} from "#/components/form/CategorySelectInput";
import { DynamicSelectInput } from "#/components/form/DynamicSelectInput";
import { ResetDateTimeButton } from "#/components/form/ResetDateTimeButton";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";
import { Separator } from "#/components/ui/separator";
import { useProfile } from "#/hooks/use-profile";
import { currencyOptionText } from "#/lib/form/currencyOptionText";
import {
	DateTimeInput,
	NumberInput,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
} from "@/components/admin";

export function TransactionForm({
	type,
	setType,
	toolbar,
	readOnly = false,
}: SpentReceivedTabsProps & {
	toolbar?: React.JSX.Element;
	readOnly?: boolean;
}) {
	const { data: profile, isPending: isProfilePending } = useProfile();

	const defaultValues = useMemo(
		() => ({
			category_id: profile?.default_category_id,
			sub_category_id: profile?.default_sub_category_id,
			project_id: profile?.default_project_id,
			profile_id: profile?.id,
			transaction_at: new Date().toISOString(),
			currency_id: profile?.default_currency_id,
			transaction_type_id: profile?.default_transaction_type_id,
		}),
		[profile],
	);

	if (isProfilePending) {
		return <Spinner />;
	}

	return (
		<SimpleForm
			toolbar={readOnly ? null : toolbar}
			defaultValues={readOnly ? undefined : defaultValues}
			onSubmit={readOnly ? () => {} : undefined}
		>
			<div className="flex justify-center items-end gap-4">
				<SpentReceivedTabs type={type} setType={setType} disabled={readOnly} />
				<ReferenceInput
					source="transaction_type_id"
					reference="transaction_type"
				>
					<SelectInput label="Type" validate={required()} disabled={readOnly} />
				</ReferenceInput>

				<NumberInput
					autoFocus={!readOnly}
					disabled={readOnly}
					source="amount"
					label="Amount"
					type="number"
					validate={required()}
					format={(value) => Math.abs(Number(value))}
				/>
			</div>

			<Separator />

			<DynamicCategorySelectInput disabled={readOnly} />

			<DynamicChildCategorySelectInput disabled={readOnly} />

			<Separator />

			<TextInput
				source="description"
				label="Description"
				multiline
				disabled={readOnly}
			/>

			<Accordion>
				<AccordionItem value="advanced">
					<AccordionTrigger>Advanced</AccordionTrigger>
					<AccordionContent keepMounted className="space-y-4">
						<ReferenceInput source="profile_id" reference="profile">
							<SelectInput
								label="Owner"
								disabled={readOnly}
								optionText={(profile) =>
									`${profile.first_name} ${profile.last_name}`
								}
							/>
						</ReferenceInput>

						<ReferenceInput source="currency_id" reference="currency">
							<SelectInput
								label="Currency"
								disabled={readOnly}
								optionText={currencyOptionText}
								validate={required()}
							/>
						</ReferenceInput>

						<div className="col-span-2 flex items-end gap-4">
							<DateTimeInput
								className="flex-1"
								source="transaction_at"
								disabled={readOnly}
								validate={required()}
							/>
							{readOnly ? null : <ResetDateTimeButton />}
						</div>

						<ReferenceInput source="project_id" reference="transaction_project">
							<DynamicSelectInput
								label="Project"
								optionText="value"
								disabled={readOnly}
							/>
						</ReferenceInput>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</SimpleForm>
	);
}

import type { AutoSyncConf } from "@piga/db/schema";
import { required, useRecordContext, type ValidateForm } from "ra-core";
import {
	BooleanInput,
	NumberInput,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
} from "@/components/admin";

// PostgREST returns database column names, not Drizzle property names.
type AutoSyncConfRecord = Omit<
	AutoSyncConf,
	"srcName" | "srcLabel" | "isEnabled"
> & {
	src_name: string;
	src_label: string;
	is_enabled: boolean;
};

const validateConfiguration: ValidateForm = (values) => {
	const errors: Record<string, string> = {};
	if (!Number.isInteger(values.lookback_days) || values.lookback_days <= 0) {
		errors.lookback_days = "Enter a positive whole number.";
	}
	if (values.is_enabled) {
		if (!values.transaction_type_id) {
			errors.transaction_type_id = "Select a transaction type before enabling.";
		}
		if (!values.credentials_secret_id) {
			errors.is_enabled = "Configure credentials before enabling this source.";
		} else if (
			values.src_name?.toLowerCase() === "max" &&
			(typeof values.public_config?.username !== "string" ||
				!values.public_config.username.trim())
		) {
			errors.is_enabled = "Enter a MAX username before enabling this source.";
		}
	}
	return errors;
};

export const AutoSyncConfForm = () => {
	const record = useRecordContext<AutoSyncConfRecord>();
	return (
		<SimpleForm validate={validateConfiguration}>
			<TextInput source="src_name" label="Source" disabled />
			<TextInput source="src_label" label="Label" validate={required()} />
			<NumberInput
				source="lookback_days"
				label="Lookback days"
				min={1}
				step={1}
				validate={required()}
			/>
			<ReferenceInput source="transaction_type_id" reference="transaction_type">
				<SelectInput label="Transaction type" />
			</ReferenceInput>
			{record?.src_name.toLowerCase() === "max" && (
				<TextInput source="public_config.username" label="MAX username" />
			)}
			<p className="text-sm text-muted-foreground">
				Credentials:{" "}
				{record?.credentials_secret_id ? "Configured" : "Not configured"}.
				Credential updates will be available in a later step.
			</p>
			<BooleanInput source="is_enabled" label="Enabled" />
		</SimpleForm>
	);
};

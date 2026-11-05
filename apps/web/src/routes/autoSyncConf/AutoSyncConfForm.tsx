import type { AutoSyncConf } from "@piga/db/schema";
import {
	required,
	useNotify,
	useRecordContext,
	useSaveContext,
	type ValidateForm,
} from "ra-core";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import {
	BooleanInput,
	NumberInput,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
} from "#/components/admin";
import { updateAutoSyncCredentials } from "#/lib/updateAutoSyncCredentials";

// PostgREST returns database column names, not Drizzle property names.
export type AutoSyncConfRecord = Omit<
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
	const { save } = useSaveContext();
	const notify = useNotify();

	const [credentialsSaved, setCredentialsSaved] = useState(false);
	const isMax = record?.src_name.toLowerCase() === "max";
	const configured = Boolean(record?.credentials_secret_id) || credentialsSaved;

	const submit = async (values: FieldValues) => {
		if (!save) return;
		const password = typeof values.password === "string" ? values.password : "";
		if (isMax && password.trim()) {
			try {
				// TODO: this should be a generic call not only for max
				await updateAutoSyncCredentials(password);

				setCredentialsSaved(true);
			} catch {
				notify(
					"Unable to save credentials. Settings were not saved. Check your session and try again.",
					{ type: "error" },
				);
				return;
			}
		}
		// Send only editable public fields through the data provider, never passwords or Vault IDs.
		return save({
			src_label: values.src_label,
			lookback_days: values.lookback_days,
			transaction_type_id: values.transaction_type_id,
			public_config: values.public_config,
			is_enabled: values.is_enabled,
		});
	};

	return (
		<SimpleForm
			onSubmit={submit}
			validate={(values) =>
				validateConfiguration({
					...values,
					credentials_secret_id:
						configured || (isMax && Boolean(values.password?.trim())),
				})
			}
		>
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

			{isMax && (
				<TextInput
					source="password"
					label="MAX password"
					type="password"
					autoComplete="new-password"
					helperText="Leave blank to keep the existing password."
				/>
			)}
			<BooleanInput source="is_enabled" label="Enabled" />
		</SimpleForm>
	);
};

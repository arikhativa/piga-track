import { AutoSyncConfForm, type AutoSyncConfRecord } from "./AutoSyncConfForm";

export const AutoSyncConfEdit = () => (
	<Edit
		actions={false}
		mutationMode="pessimistic"
		transform={(data: AutoSyncConfRecord) => ({
			src_label: data.src_label,
			lookback_days: data.lookback_days,
			public_config: data.public_config,
			is_enabled: data.is_enabled,
			transaction_type_id: data.transaction_type_id || null,
		})}
	>
		<AutoSyncConfForm />
	</Edit>
);

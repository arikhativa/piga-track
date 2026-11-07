import { Edit } from "#/components/admin";
import { AutoSyncConfForm } from "./AutoSyncConfForm";

export const AutoSyncConfEdit = () => (
	<Edit actions={false} mutationMode="pessimistic">
		<AutoSyncConfForm />
	</Edit>
);

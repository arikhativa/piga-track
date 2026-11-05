import { Edit } from "@/components/admin";
import { AutoSyncConfForm } from "./AutoSyncConfForm";

export const AutoSyncConfEdit = () => (
	<Edit mutationMode="pessimistic">
		<AutoSyncConfForm />
	</Edit>
);

import type { Profile } from "@piga/db/types";
import { useGetIdentity, useGetOne } from "ra-core";

export const useProfile = () => {
	const user = useGetIdentity();

	return useGetOne<Profile>("profile", {
		id: user.data?.id as string,
	});
};

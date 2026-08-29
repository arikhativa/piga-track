import { useGetIdentity, useGetOne } from "ra-core";
import type { Profile } from "#/db/schema";

export const useProfile = () => {
	const user = useGetIdentity();

	return useGetOne<Profile>("profile", {
		id: user.data?.id as string,
	});
};

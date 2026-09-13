import { useGetList } from "ra-core";
import type { ImportProfile } from "#/db/schema";

export const useImportProfiles = () => {
	return useGetList<ImportProfile>("import_profile", {
		pagination: {
			page: 1,
			perPage: 100,
		},
	});
};

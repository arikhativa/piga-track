import type { ImportProfile } from "@piga/db/types";
import { useGetList } from "ra-core";

export const useImportProfiles = () => {
	return useGetList<ImportProfile>("import_profile", {
		pagination: {
			page: 1,
			perPage: 100,
		},
	});
};

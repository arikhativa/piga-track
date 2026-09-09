import { useGetList } from "ra-core";
import type { ImportProfile } from "#/db/schema";

// TODO maybe remove this - logic will be on edge func
export const useImportProfiles = () => {
	return useGetList<ImportProfile>("import_profile", {
		pagination: {
			page: 1,
			perPage: 100,
		},
	});
};

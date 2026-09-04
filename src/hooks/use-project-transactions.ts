import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "#/lib/supabaseClient";

export const getProjectTransactions = async (projectId: number) => {
	const { data, error } = await supabaseClient
		.from("transaction")
		.select("*")
		.eq("project_id", projectId);

	if (error) {
		throw error;
	}

	return data;
};

export const useProjectTransactions = (projectId: number | undefined) => {
	return useQuery({
		queryKey: ["ProjectTransactions", projectId],
		queryFn: async () => {
			if (!projectId) throw new Error("projectId must be defend");
			return getProjectTransactions(projectId);
		},
		enabled: projectId !== undefined,
	});
};

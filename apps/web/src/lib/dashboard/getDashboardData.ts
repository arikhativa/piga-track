import {
	type DashboardRequestInput,
	type DashboardResponse,
	dashboardRequestSchema,
	dashboardResponseSchema,
} from "@piga/contracts/dashboard-data";
import { supabaseClient } from "#/lib/supabaseClient";

export async function getDashboardData(
	input: DashboardRequestInput,
): Promise<DashboardResponse> {
	const body = dashboardRequestSchema.parse(input);
	const { data, error } = await supabaseClient.functions.invoke(
		"dashboard-data",
		{ body },
	);

	if (error) {
		throw error;
	}

	const response = dashboardResponseSchema.safeParse(data);
	if (!response.success) {
		throw new Error(
			"dashboard-data contract error: malformed successful response",
			{ cause: response.error },
		);
	}

	return response.data;
}

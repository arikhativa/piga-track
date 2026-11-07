import { supabaseClient } from "#/lib/supabaseClient";

// TODO: this should be a generic call not only for max
export async function updateAutoSyncCredentials(
	password: string,
): Promise<void> {
	const { data, error } = await supabaseClient.functions.invoke(
		"update-auto-sync-credentials",
		{
			body: {
				credentials: password.trim() ? { password } : {},
			},
		},
	);

	// Never surface response bodies or request context that may contain secrets.
	if (error || data?.success !== true) {
		throw new Error(
			"Unable to save credentials. Check your session and try again.",
		);
	}
}

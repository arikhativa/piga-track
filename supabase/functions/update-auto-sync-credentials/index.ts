import "@supabase/functions-js/edge-runtime.d.ts";
import { createSupabaseContext } from "@supabase/server";
import { jsonResponse } from "../_shared/helper.ts";

type Database = {
	public: {
		Tables: Record<string, never>;
		Views: Record<string, never>;
		Functions: {
			update_auto_sync_credentials: {
				Args: { p_credentials: { password?: string } };
				Returns: { success: boolean };
			};
		};
	};
};

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") return jsonResponse("ok");
	if (req.method !== "POST") {
		return jsonResponse({ error: "Method not allowed" }, 405);
	}

	try {
		// The server SDK reads the publishable/secret key dictionaries and verifies
		// the caller's user JWT before making the admin client available.
		const { data: context, error: authError } =
			await createSupabaseContext<Database>(req, { auth: "user" });
		if (authError) {
			if (authError.status >= 500) {
				return jsonResponse({ error: "Service unavailable" }, 503);
			}
			return jsonResponse({ error: "Authentication required" }, 401);
		}
		if (!context?.userClaims?.id) {
			return jsonResponse({ error: "Authentication required" }, 401);
		}

		let body: unknown;
		try {
			body = await req.json();
		} catch {
			return jsonResponse({ error: "Invalid request" }, 400);
		}
		if (
			!isObject(body) ||
			Object.keys(body).some((key) => key !== "credentials") ||
			!isObject(body.credentials) ||
			Object.keys(body.credentials).some((key) => key !== "password") ||
			("password" in body.credentials &&
				typeof body.credentials.password !== "string")
		) {
			return jsonResponse({ error: "Invalid request" }, 400);
		}

		// Only this restricted RPC accesses Vault; it also resolves MAX server-side.
		const { error } = await context.supabaseAdmin
			.rpc("update_auto_sync_credentials", {
				p_credentials:
					typeof body.credentials.password === "string"
						? { password: body.credentials.password }
						: {},
			})
			.abortSignal(AbortSignal.timeout(10_000));
		if (error) {
			if (error.code === "22023") {
				return jsonResponse({ error: "Invalid credentials" }, 400);
			}
			if (error.code === "P0002") {
				return jsonResponse({ error: "Source not found" }, 404);
			}
			return jsonResponse({ error: "Unable to update credentials" }, 500);
		}
		return jsonResponse({ success: true });
	} catch {
		// Never log or return errors that could contain credentials or tokens.
		return jsonResponse({ error: "Unable to update credentials" }, 500);
	}
});

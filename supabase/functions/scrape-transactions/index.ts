import "@supabase/functions-js/edge-runtime.d.ts";

import { createDb } from "../_shared/db.ts";
import { withSupabase } from "@supabase/server";
import { loadSources } from "./lib/loadSources.ts";
import { syncMax } from "./sources/max/index.ts";

Deno.serve(withSupabase({ auth: ["user", "secret:secret"] }, async (request: Request): Promise<Response> => {
  try {

		if (request.method !== "POST") {
			return Response.json(
				{ error: "Method not allowed" },
				{ status: 405, headers: { Allow: "POST" } },
			);
		}

		const db = createDb();
		try {
      const sources = await loadSources(db);

			const results = [];
			for (const source of sources) {
				if (source.srcName.toLowerCase() !== "max") {
					continue;
				}

				const transactions = await syncMax(db, source);
				results.push({
					id: source.id,
					name: source.srcName,
					label: source.srcLabel,
					fetched: transactions.length,
				});
			}

			return Response.json({ sources: results });
		} finally {
			await db.$client.end({ timeout: 5 });
		}
	} catch {
		return Response.json(
			{ error: "Unable to scrape sources" },
			{ status: 500 },
		);
	}
}));

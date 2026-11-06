import "@supabase/functions-js/edge-runtime.d.ts";

import { createDb } from "../_shared/db.ts";
import { authenticate } from "./lib/authenticate.ts";
import { loadSources } from "./lib/loadSources.ts";
import { syncMax } from "./sources/max/index.ts";

Deno.serve(async (request: Request): Promise<Response> => {
  try {
		if (!(await authenticate(request))) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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
});

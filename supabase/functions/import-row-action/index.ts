import "@supabase/functions-js/edge-runtime.d.ts";

import z from "zod";
import { createDb } from "../_shared/db.ts";
import { jsonResponse } from "../_shared/helper.ts";
import { actions } from "./actions/index.ts";
import { getImportRows } from "./lib/get-import-rows.ts";
import { validateSameBatch } from "./lib/validate-import-rows.ts";
import { importRowActionSchema } from "./schema.ts";

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") {
		return jsonResponse("ok");
	}
	let db: ReturnType<typeof createDb> | undefined;

	try {
		db = createDb();

		const body = importRowActionSchema.parse(await req.json());

		const result = await db.transaction(async (tx) => {
			let rows: Awaited<ReturnType<typeof getImportRows>> | undefined;

			if (body.import_row_ids.length) {
				rows = await getImportRows(tx, body.import_row_ids);

				validateSameBatch(rows);
			}

			const action = actions[body.action];

			if (!action) {
				throw new Error(`Unsupported action: ${body.action}`);
			}

			return action({
				db: tx,
				rows: rows || [],
				profileId: body.profileId,
				value: body.value,
			});
		});

		return jsonResponse({ data: result }, 200);
	} catch (error) {
		console.error(error);

		if (error instanceof z.ZodError) {
			return jsonResponse(
				{
					error: "Invalid request",
					issues: error.issues,
				},
				400,
			);
		}

		return jsonResponse(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to process import rows",
			},
			500,
		);
	} finally {
		await db?.$client.end();
	}
});

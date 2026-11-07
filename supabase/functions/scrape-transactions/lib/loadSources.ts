import { type AutoSyncConf, autoSyncConf } from "@piga/db/schema";
import { eq } from "drizzle-orm";
import type { createDb } from "../../_shared/db.ts";

export async function loadSources(
	db: ReturnType<typeof createDb>,
): Promise<AutoSyncConf[]> {
	return await db
		.select()
		.from(autoSyncConf)
		.where(eq(autoSyncConf.isEnabled, true));
}

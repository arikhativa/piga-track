import type { AutoSyncConf } from "@piga/db/schema";
import type { createDb } from "../../../_shared/db.ts";
import { loadCredential } from "../../lib/loadCredential.ts";
import { login } from "./login.ts";
import { scrape } from "./scrape.ts";

export async function syncMax(
	db: ReturnType<typeof createDb>,
	config: AutoSyncConf,
): Promise<Record<string, unknown>[]> {
	if (config.srcName.toLowerCase() !== "max") {
		throw new Error("Expected MAX source configuration");
	}

	const username = config.public_config.username;
	if (typeof username !== "string" || !username.trim()) {
		throw new Error("MAX username is required");
	}
	if (!Number.isInteger(config.lookback_days) || config.lookback_days <= 0) {
		throw new Error("MAX lookback days must be a positive integer");
	}

	const end = new Date();
	const start = new Date(end);
	start.setUTCDate(start.getUTCDate() - config.lookback_days);
	if (!Number.isFinite(start.getTime())) {
		throw new Error("MAX lookback days exceed the supported date range");
	}
	const startDate = start.toISOString().slice(0, 10);
	const endDate = end.toISOString().slice(0, 10);

	const credentials = await loadCredential(db, config);

	if (
		typeof credentials.password !== "string" ||
		credentials.password.trim().length === 0
	) {
		throw new Error("MAX password is required");
	}

	const cookie = await login(username, credentials.password);
  const ret = await scrape({ cookie, startDate, endDate, date: endDate });
  console.log("ret",ret  )
	return ret
}

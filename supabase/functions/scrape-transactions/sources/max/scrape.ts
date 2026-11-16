import { browserScrapeCode } from "./browser/workflow.ts";

export interface ScrapeOptions {
	username: string;
	password: string;
	startDate: string;
	endDate: string;
	date?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function scrape({
	username,
	password,
	startDate,
	endDate,
	date = endDate,
}: ScrapeOptions): Promise<Record<string, unknown>[]> {
	const token = Deno.env.get("BROWSERLESS_TOKEN")?.trim();
	if (!token) {
		throw new Error("BROWSERLESS_TOKEN is not configured");
	}
	if (!username.trim() || !password.trim()) {
		throw new Error("MAX username and password are required");
	}
	if (!startDate || !endDate) {
		throw new Error("MAX startDate and endDate are required");
	}

	const url = new URL("https://production-sfo.browserless.io/function");
	url.searchParams.set("token", token);
	url.searchParams.set("timeout", "90000");

	let response: Response;
	try {
		response = await fetch(url, {
			method: "POST",
			redirect: "error",
			signal: AbortSignal.timeout(100_000),
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				code: browserScrapeCode,
				context: { username, password, startDate, endDate, date },
			}),
		});
	} catch {
		// Fetch errors may include the request URL, which contains the API token.
		throw new Error("Browserless request failed or timed out");
	}
	if (!response.ok) {
		await response.body?.cancel();
		if (response.status === 401 || response.status === 403) {
			throw new Error(
				"Browserless authentication failed; check the token and shared-cloud deployment",
			);
		}
		if (response.status === 429) {
			throw new Error("Browserless rate or concurrency limit reached");
		}
		throw new Error(`Browserless request failed: HTTP ${response.status}`);
	}

	let payload: unknown;
	try {
		payload = await response.json();
	} catch {
		throw new Error("Browserless returned invalid JSON");
	}
	// Accept the JSON data response and the documented data/type envelope.
	if (
		isRecord(payload) &&
		payload.type === "application/json" &&
		isRecord(payload.data)
	) {
		payload = payload.data;
	}
	if (!isRecord(payload)) {
		throw new Error("Browserless returned an invalid result");
	}
	if (payload.ok !== true) {
		const stage = payload.stage === "login" ? "login" : "transactions";
		const errorCode =
			typeof payload.errorCode === "string" &&
			/^MAX_[A-Z_0-9]+$/.test(payload.errorCode)
				? payload.errorCode
				: "MAX_BROWSER_FLOW_FAILED";
		const phase =
			typeof payload.phase === "string" &&
			[
				"login_page",
				"login_evaluation",
				"login_form",
				"login_submit",
				"transactions_page",
				"transactions_fetch",
			].includes(payload.phase)
				? payload.phase
				: "unknown";
		const errorType =
			typeof payload.errorType === "string" &&
			[
				"TimeoutError",
				"ProtocolError",
				"TargetCloseError",
				"TypeError",
				"ReferenceError",
				"Error",
			].includes(payload.errorType)
				? payload.errorType
				: "Error";
		console.error("MAX Browserless scrape failed", {
			stage,
			phase,
			errorType,
			errorCode,
		});
		throw new Error(`MAX ${stage} failed: ${errorCode}`);
	}
	if (
		!Array.isArray(payload.transactions) ||
		!payload.transactions.every(isRecord)
	) {
		throw new Error("Browserless returned an invalid transactions list");
	}

	return payload.transactions;
}

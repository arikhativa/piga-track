import { browserLoginCode } from "./browser/login.ts";

export interface ScrapeOptions {
	username: string;
	password: string;
	startDate: string;
	endDate: string;
	date?: string;
}

// Both operations must run in the same browser; cookies alone are insufficient.
const browserScrapeCode = `${browserLoginCode}
export default async ({ page, context }) => {
	let stage = "login";
	let phase = "login_page";
	try {
		const session = await login(page, context.username, context.password, (value) => {
			phase = value;
		});
		stage = "transactions";
		phase = "transactions_page";
		const navigation = await page.goto("https://www.max.co.il/transaction-details/personal", {
			waitUntil: "networkidle2",
			timeout: 30000,
		});
		if (!navigation || !navigation.ok() ||
			new URL(page.url()).origin !== "https://www.max.co.il") {
			throw new Error("MAX_TRANSACTIONS_PAGE_FAILED");
		}

		phase = "transactions_fetch";
		const transactions = await page.evaluate(async (context) => {
			const url = new URL(
				"/api/registered/transactionDetails/getTransactionsAndGraphs",
				window.location.origin,
			);
			url.searchParams.set("filterData", JSON.stringify({
				userIndex: -1,
				cardIndex: -1,
				monthView: false,
				date: context.date,
				dates: { startDate: context.startDate, endDate: context.endDate },
				bankAccount: { bankAccountIndex: -1, cards: null },
			}));
			url.searchParams.set("firstCallCardIndex", "-1null");
			url.searchParams.set("v", context.version);

			const response = await window.fetch(url.toString(), {
				credentials: "same-origin",
				redirect: "error",
				signal: AbortSignal.timeout(20000),
				headers: {
					Accept: "application/json, text/plain, */*",
					SID: sessionStorage.getItem("SessionId") || crypto.randomUUID(),
					CID: crypto.randomUUID(),
					URF: "/transaction-details/personal",
					CAV: context.version,
				},
			});
			if (!response.ok) {
				throw new Error("MAX_TRANSACTIONS_HTTP_" + response.status);
			}
			let data;
			try {
				data = await response.json();
			} catch {
				throw new Error("MAX_TRANSACTIONS_INVALID_JSON");
			}
			const isRecord = (value) =>
				typeof value === "object" && value !== null && !Array.isArray(value);
			if (!isRecord(data) || (data.returnCode ?? data.ReturnCode) !== 0) {
				throw new Error("MAX_TRANSACTIONS_UNSUCCESSFUL");
			}
			const result = data.result ?? data.Result;
			if (!isRecord(result) || !Array.isArray(result.transactions) ||
				!result.transactions.every(isRecord)) {
				throw new Error("MAX_TRANSACTIONS_INVALID_LIST");
			}
			return result.transactions;
		}, {
			startDate: context.startDate,
			endDate: context.endDate,
			date: context.date,
			version: session.version,
		});

		return { data: { ok: true, transactions }, type: "application/json" };
	} catch (error) {
		// Never return arbitrary browser exceptions, page content, or credentials.
		const knownCodes = [
			"MAX_LOGIN_PAGE_FAILED", "MAX_UNEXPECTED_LOGIN_ORIGIN",
			"MAX_INVALID_CLIENT_CONTEXT", "MAX_LOGIN_REJECTED_OR_VERIFICATION_REQUIRED",
			"MAX_TRANSACTIONS_PAGE_FAILED", "MAX_TRANSACTIONS_UNSUCCESSFUL",
			"MAX_TRANSACTIONS_INVALID_LIST",
		];
		// Puppeteer may wrap evaluation errors with a prefix and stack trace.
		const candidates = typeof error?.message === "string"
			? error.message.match(/MAX_[A-Z_0-9]+/g) ?? [] : [];
		const explicitCode = candidates.find((code) => knownCodes.includes(code) ||
			/^MAX_(CONTEXT|SESSION|LOGIN|TRANSACTIONS)_(HTTP_[1-5][0-9]{2}|INVALID_JSON|NETWORK_FAILED|TIMEOUT)$/.test(code));
		const errorType = ["TimeoutError", "ProtocolError", "TargetCloseError", "TypeError", "ReferenceError"]
			.includes(error?.name) ? error.name : "Error";
		const errorCode = explicitCode ?? (errorType === "TimeoutError"
			? "MAX_BROWSER_TIMEOUT" : "MAX_BROWSER_FLOW_FAILED");
		return {
			data: { ok: false, stage, phase, errorType, errorCode },
			type: "application/json",
		};
	}
}
`;

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

import { jsonResponse } from "../_shared/helper.ts";

const USERNAME = "yoavrbb@gmail.com";
const START_DATE = "2026-10-01";
const END_DATE = "2026-10-31";
const VERSION = "V4.224-RC.10.134";
const MAX_ORIGIN = "https://www.max.co.il";

type LogEntry = { timestamp: string; stage: string; message: string };

class ScrapeError extends Error {
	constructor(
		message: string,
		readonly status = 502,
	) {
		super(message);
	}
}

async function readMaxResponse(response: Response, stage: string) {
	if (!response.ok) {
		throw new ScrapeError(
			`Max ${stage} failed: HTTP ${response.status}. Production IP blocking or browser verification may be required.`,
		);
	}

	let data: unknown;
	try {
		data = await response.json();
	} catch {
		throw new ScrapeError(
			`Max ${stage} returned non-JSON; browser verification may be required or the session may have expired.`,
		);
	}
	if (!data || typeof data !== "object" || Array.isArray(data)) {
		throw new ScrapeError(
			`Max ${stage} returned an unexpected response shape.`,
		);
	}
	return data as Record<string, unknown>;
}

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") return jsonResponse("ok");
	if (req.method !== "POST") {
		return jsonResponse({ error: "Only POST is supported." }, 405);
	}

	const logs: LogEntry[] = [];
	let stage = "auth";
	const log = (message: string) => {
		const entry = { timestamp: new Date().toISOString(), stage, message };
		logs.push(entry);
		console.log("[scrape-transactions]", entry);
	};

	try {
		// Gateway JWT verification is disabled; validate the user with Auth instead.
		const authorization = req.headers.get("Authorization");
		if (!authorization?.startsWith("Bearer ")) {
			throw new ScrapeError("Sign in before running the scrape test.", 401);
		}
		const supabaseUrl = Deno.env.get("SUPABASE_URL");
		const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
		if (!supabaseUrl || !anonKey) {
			throw new ScrapeError(
				"Supabase Auth environment is not configured.",
				500,
			);
		}
		const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
			headers: { Authorization: authorization, apikey: anonKey },
			signal: AbortSignal.timeout(10_000),
		});
		if (!authResponse.ok) {
			throw new ScrapeError("Session validation failed. Sign in again.", 401);
		}
		const user = await authResponse.json();
		// This test exposes personal financial data and uses one fixed Max account.
		// if (user.email?.toLowerCase() !== USERNAME || !user.email_confirmed_at) {
		// 	throw new ScrapeError(
		// 		"Only the verified account owner can run this test.",
		// 		403,
		// 	);
		// }
		log("Account owner authenticated.");

		stage = "configuration";
		const password = Deno.env.get("MAX_PASSWORD");
		if (!password) {
			throw new ScrapeError("Missing Supabase secret: MAX_PASSWORD.", 500);
		}

		stage = "login";
		log("Starting Max login.");
		const loginResponse = await fetch(`${MAX_ORIGIN}/api/login/login`, {
			method: "POST",
			redirect: "error",
			signal: AbortSignal.timeout(30_000),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json, text/plain, */*",
				Origin: MAX_ORIGIN,
				Referer: `${MAX_ORIGIN}/`,
			},
			body: JSON.stringify({ username: USERNAME, password, id: null }),
		});
		const loginData = await readMaxResponse(loginResponse, "login");
		const cookies = new Map<string, string>();
		for (const header of loginResponse.headers.getSetCookie()) {
			const pair = header.split(";", 1)[0];
			const separator = pair.indexOf("=");
			if (separator > 0) {
				cookies.set(pair.slice(0, separator), pair.slice(separator + 1));
			}
		}
		if (!cookies.get(".AUTHONLINE40V3")) {
			const code =
				typeof loginData.returnCode === "number"
					? ` returnCode=${loginData.returnCode}.`
					: "";
			throw new ScrapeError(
				`Max login did not issue an authentication cookie.${code} Check credentials, MFA requirements, or browser verification. Login response and cookies are omitted for security.`,
			);
		}
		log("Max issued an authentication cookie.");

		stage = "transactions";
		log(`Fetching all users/cards for ${START_DATE} through ${END_DATE}.`);
		const url = new URL(
			`${MAX_ORIGIN}/api/registered/transactionDetails/getTransactionsAndGraphs`,
		);
		url.searchParams.set(
			"filterData",
			JSON.stringify({
				userIndex: -1,
				cardIndex: -1,
				monthView: false,
				date: new Date().toISOString().slice(0, 10),
				dates: { startDate: START_DATE, endDate: END_DATE },
				bankAccount: { bankAccountIndex: -1, cards: null },
			}),
		);
		url.searchParams.set("firstCallCardIndex", "-1null");
		url.searchParams.set("v", VERSION);

		const response = await fetch(url, {
			redirect: "error",
			signal: AbortSignal.timeout(30_000),
			headers: {
				Accept: "application/json, text/plain, */*",
				Referer: `${MAX_ORIGIN}/transaction-details/personal`,
				CAV: VERSION,
				Cookie: Array.from(cookies, ([name, value]) => `${name}=${value}`).join(
					"; ",
				),
			},
		});
		const data = await readMaxResponse(response, "transactions request");
		if (data.returnCode !== 0) {
			const code =
				typeof data.returnCode === "number"
					? String(data.returnCode)
					: "missing or invalid";
			throw new ScrapeError(
				`Max transactions request failed: returnCode ${code}.`,
			);
		}
		if (data.result === undefined || data.result === null) {
			throw new ScrapeError(
				"Max transactions response did not contain a result.",
			);
		}
		log("Received Max result. No data was written to the database.");
		return jsonResponse({
			success: true,
			startDate: START_DATE,
			endDate: END_DATE,
			logs,
			// Keep the complete result, including transaction details and graphs.
			result: data.result,
		});
	} catch (error) {
		const timedOut =
			error instanceof Error &&
			["TimeoutError", "AbortError"].includes(error.name);
		const message =
			error instanceof ScrapeError
				? error.message
				: timedOut
					? `Request timed out during ${stage}.`
					: `Request failed during ${stage}. A network, TLS, redirect, or upstream response error occurred.`;
		// Never log raw exceptions, credentials, cookies, or upstream login bodies.
		log(message);
		return jsonResponse(
			{ success: false, stage, error: message, logs },
			error instanceof ScrapeError ? error.status : timedOut ? 504 : 502,
		);
	}
});

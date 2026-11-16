import { browserLoginCode } from "./login.ts";
import { browserTransactionsCode } from "./transactions.ts";

// Compose one remote execution so login and fetching share a browser session.
export const browserScrapeCode = `${browserLoginCode}
${browserTransactionsCode}
export default async ({ page, context }) => {
	let stage = "login";
	let phase = "login_page";
	const onPhase = (value) => { phase = value; };
	try {
		const session = await login(page, context.username, context.password, onPhase);
		stage = "transactions";
		const transactions = await fetchTransactions(page, context, session, onPhase);
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

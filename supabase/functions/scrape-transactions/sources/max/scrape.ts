export interface ScrapeOptions {
	cookie: string;
	startDate: string;
	endDate: string;
	date?: string;
	version?: string;
	sessionHeaders?: Record<string, string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function scrape({
	cookie,
	startDate,
	endDate,
	date = new Date().toISOString().slice(0, 10),
	version = "V4.224-RC.10.134",
	sessionHeaders = {},
}: ScrapeOptions): Promise<Record<string, unknown>[]> {
	try {
		if (!cookie.trim()) {
			throw new Error("An authenticated MAX session cookie is required");
		}
		if (!startDate || !endDate) {
			throw new Error(
				"startDate and endDate are required for a date-range query",
			);
		}

		const url = new URL(
			"https://www.max.co.il/api/registered/transactionDetails/getTransactionsAndGraphs",
		);
		url.searchParams.set(
			"filterData",
			JSON.stringify({
				userIndex: -1,
				cardIndex: -1,
				monthView: false,
				date,
				dates: { startDate, endDate },
				bankAccount: { bankAccountIndex: -1, cards: null },
			}),
		);
		url.searchParams.set("firstCallCardIndex", "-1null");
		url.searchParams.set("v", version);

		const response = await fetch(url, {
			redirect: "error",
			headers: {
				...sessionHeaders,
				Accept: "application/json, text/plain, */*",
				Referer: "https://www.max.co.il/transaction-details/personal",
				CAV: version,
				Cookie: cookie,
			},
		});

		if (!response.ok) {
			throw new Error(
				`MAX transactions request failed: HTTP ${response.status}`,
			);
		}

		let data: unknown;
		try {
			data = await response.json();
		} catch {
			throw new Error(
				"MAX returned non-JSON; the session may have expired or browser verification may be required",
			);
		}

		if (!isRecord(data) || data.returnCode !== 0) {
			throw new Error(
				"MAX transactions request failed: invalid or unsuccessful response",
			);
		}
		if (
			!isRecord(data.result) ||
			!Array.isArray(data.result.transactions) ||
			!data.result.transactions.every(isRecord)
		) {
			throw new Error(
				"MAX transactions response has an invalid transactions list",
			);
		}

		return data.result.transactions;
	} catch (error) {
		console.error("MAX scrape failed", error);
		return [];
	}
}

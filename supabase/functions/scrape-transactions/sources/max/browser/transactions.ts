// JavaScript source executed in the same remote browser session as login.
export const browserTransactionsCode = `
async function fetchTransactions(page, context, session, onPhase) {
	onPhase("transactions_page");
	const navigation = await page.goto("https://www.max.co.il/transaction-details/personal", {
		waitUntil: "networkidle2",
		timeout: 30000,
	});
	if (!navigation || !navigation.ok() ||
		new URL(page.url()).origin !== "https://www.max.co.il") {
		throw new Error("MAX_TRANSACTIONS_PAGE_FAILED");
	}

	onPhase("transactions_fetch");
	return await page.evaluate(async (context) => {
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
}
`;

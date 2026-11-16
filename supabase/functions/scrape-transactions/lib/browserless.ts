function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function runBrowserless(
	code: string,
	context: Record<string, unknown>,
): Promise<unknown> {
	const token = Deno.env.get("BROWSERLESS_TOKEN")?.trim();
	if (!token) {
		throw new Error("BROWSERLESS_TOKEN is not configured");
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
			body: JSON.stringify({ code, context }),
		});
	} catch {
		// Fetch errors may include the request URL, which contains the API token.
		throw new Error("Browserless request failed or timed out");
	}
	if (!response.ok) {
		try {
			await response.body?.cancel();
		} catch {
			// Cleanup failures must not expose raw errors or obscure the HTTP status.
		}
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
	return payload;
}

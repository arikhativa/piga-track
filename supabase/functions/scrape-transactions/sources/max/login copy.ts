function updateCookies(cookies: Map<string, string>, headers: Headers) {
	for (const header of headers.getSetCookie()) {
		const [pair, ...attributes] = header.split(";");
		const separator = pair.indexOf("=");
		if (separator <= 0) continue;

		const name = pair.slice(0, separator).trim();
		const value = pair.slice(separator + 1);
		const maxAge = attributes.find((attribute) =>
			attribute.trim().toLowerCase().startsWith("max-age="),
		);
		const expires = attributes.find((attribute) =>
			attribute.trim().toLowerCase().startsWith("expires="),
		);
		const expired = maxAge
			? Number(maxAge.slice(maxAge.indexOf("=") + 1)) <= 0
			: expires
				? Date.parse(expires.slice(expires.indexOf("=") + 1)) <= Date.now()
				: false;

		if (!value || expired) {
			cookies.delete(name);
		} else {
			cookies.set(name, value);
		}
	}
}

function cookieHeader(cookies: Map<string, string>): string {
	return Array.from(cookies, ([name, value]) => `${name}=${value}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function login(
	username: string,
	password: string,
): Promise<string> {
	if (!username.trim() || !password.trim()) {
		throw new Error("MAX username and password are required");
	}

	const origin = "https://www.max.co.il";
	const loginUrl = `${origin}/login`;
	const cookies = new Map<string, string>();
	const flowTimeout = AbortSignal.timeout(60_000);
	let sessionId = crypto.randomUUID();
	let version = "";

	// Deno fetch does not persist session cookies between requests.
	async function sessionRequest(
		stage: string,
		path: string,
		init: RequestInit = {},
		includeAppHeaders = false,
	): Promise<Response> {
		const headers = new Headers(init.headers);
		headers.set(
			"Accept",
			headers.get("Accept") ?? "application/json, text/plain, */*",
		);
		headers.set("Accept-Language", "en-US,en;q=0.9");
		headers.set("Referer", loginUrl);
		if (cookies.size > 0) headers.set("Cookie", cookieHeader(cookies));
		if (init.method === "POST") {
			headers.set("Content-Type", "application/json");
			headers.set("Origin", origin);
		}
		if (includeAppHeaders) {
			headers.set("SID", sessionId);
			headers.set("CID", crypto.randomUUID());
			headers.set("URF", "/login");
			headers.set("CAV", version);
		}

		let response: Response;
		try {
			response = await fetch(`${origin}${path}`, {
				...init,
				headers,
				redirect: "error",
				signal: AbortSignal.any([flowTimeout, AbortSignal.timeout(30_000)]),
			});
		} catch (error) {
			console.error("MAX login request failed", {
				stage,
				errorType: error instanceof Error ? error.name : "UnknownError",
			});
			throw new Error(
				`MAX ${stage} request failed; check network access or timeout`,
			);
		}

		updateCookies(cookies, response.headers);
		if (!response.ok) {
			console.error("MAX login HTTP failure", {
				stage,
				status: response.status,
				contentType: response.headers.get("content-type"),
				cookieNames: Array.from(cookies.keys()),
			});
			await response.body?.cancel();
			throw new Error(`MAX ${stage} failed: HTTP ${response.status}`);
		}
		return response;
	}

	async function readJson(response: Response, stage: string): Promise<unknown> {
		try {
			return await response.json();
		} catch {
			console.error("MAX login invalid JSON", {
				stage,
				status: response.status,
				contentType: response.headers.get("content-type"),
			});
			throw new Error(
				`MAX ${stage} returned invalid JSON; browser verification may be required`,
			);
		}
	}

	const pageResponse = await sessionRequest("login page", "/login", {
		headers: { Accept: "text/html,application/xhtml+xml" },
	});
	await pageResponse.body?.cancel();

	const context = await readJson(
		await sessionRequest("client context", "/api/registered/clientcontext"),
		"client context",
	);
	if (
		!isRecord(context) ||
		context.ReturnCode !== 0 ||
		!isRecord(context.Result) ||
		typeof context.Result.Version !== "string" ||
		!context.Result.Version.trim()
	) {
		throw new Error(
			"MAX client context is missing a successful result or application version",
		);
	}
	version = context.Result.Version;

	const logoffResponse = await sessionRequest(
		"session initialization",
		"/api/login/logoff",
		{ method: "POST", body: JSON.stringify({ logoff: true }) },
		true,
	);
	await logoffResponse.body?.cancel();
	// Max's frontend refreshes its session ID after the login-page logoff.
	sessionId = crypto.randomUUID();

	const response = await sessionRequest(
		"login",
		"/api/login/login",
		{ method: "POST", body: JSON.stringify({ username, password, id: null }) },
		true,
	);
	const data = await readJson(response, "login");
	const result = isRecord(data) && isRecord(data.Result) ? data.Result : null;
	if (!isRecord(data) || data.ReturnCode !== 0 || result?.LoginStatus !== 0) {
		console.error("MAX login unsuccessful", {
			returnCode:
				isRecord(data) && typeof data.ReturnCode === "number"
					? data.ReturnCode
					: null,
			loginStatus:
				typeof result?.LoginStatus === "number" ? result.LoginStatus : null,
			loginCode:
				typeof result?.LoginCode === "number" ? result.LoginCode : null,
		});
		throw new Error(
			"MAX login was unsuccessful or requires additional verification",
		);
	}

	if (!cookies.get(".AUTHONLINE40V3")) {
		console.error("MAX login missing authentication cookie", {
			status: response.status,
			cookieNames: Array.from(cookies.keys()),
		});
		throw new Error("MAX login did not issue an authentication cookie");
	}

	return cookieHeader(cookies);
}

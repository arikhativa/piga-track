// JavaScript source executed by Browserless, not by the Edge Runtime.
// Keep this self-contained: imported Edge Function helpers are unavailable there.
export const browserLoginCode = `
async function login(page, username, password, onPhase) {
	onPhase("login_page");
	const navigation = await page.goto("https://www.max.co.il/login", {
		waitUntil: "networkidle2",
		timeout: 30000,
	});
	if (!navigation || !navigation.ok()) {
		throw new Error("MAX_LOGIN_PAGE_FAILED");
	}
	if (new URL(page.url()).origin !== "https://www.max.co.il") {
		throw new Error("MAX_UNEXPECTED_LOGIN_ORIGIN");
	}

	onPhase("login_evaluation");
	const session = await page.evaluate(async () => {
		let response;
		try {
			response = await window.fetch("/api/registered/clientcontext", {
				credentials: "same-origin",
				redirect: "error",
				signal: AbortSignal.timeout(20000),
				headers: { Accept: "application/json, text/plain, */*" },
			});
		} catch (error) {
			const reason = error?.name === "TimeoutError" || error?.name === "AbortError"
				? "TIMEOUT" : "NETWORK_FAILED";
			throw new Error("MAX_CONTEXT_" + reason);
		}
		if (!response.ok) {
			throw new Error("MAX_CONTEXT_HTTP_" + response.status);
		}
		let context;
		try {
			context = await response.json();
		} catch {
			throw new Error("MAX_CONTEXT_INVALID_JSON");
		}
		if (context?.ReturnCode !== 0 || typeof context?.Result?.Version !== "string" ||
			!context.Result.Version.trim()) {
			throw new Error("MAX_INVALID_CLIENT_CONTEXT");
		}
		return { version: context.Result.Version };
	});

	onPhase("login_form");
	await page.waitForSelector("app-user-login-form, .login-tabs", { timeout: 15000 });
	const tabHandle = await page.evaluateHandle(() =>
		Array.from(document.querySelectorAll(".nav-tabs a, .nav-tabs button, [role=tab]"))
			.find((element) => element.getClientRects().length > 0 &&
				element.textContent?.includes("כניסה עם סיסמה")) ?? null,
	);
	try {
		const tab = tabHandle.asElement();
		if (tab) await tab.click();
	} finally {
		await tabHandle.dispose();
	}

	const usernameSelector = "app-user-login-form #user-name";
	const passwordSelector = "app-user-login-form #password";
	await page.waitForSelector(usernameSelector, { visible: true, timeout: 15000 });
	await page.waitForSelector(passwordSelector, { visible: true, timeout: 15000 });
	await page.click(usernameSelector, { clickCount: 3 });
	await page.keyboard.press("Backspace");
	await page.type(usernameSelector, username);
	await page.click(passwordSelector, { clickCount: 3 });
	await page.keyboard.press("Backspace");
	await page.type(passwordSelector, password);
	await page.keyboard.press("Tab");

	onPhase("login_submit");
	// Submit the real form so Max controls its own headers and security hooks.
	const [response] = await Promise.all([
		page.waitForResponse((response) => {
			const url = new URL(response.url());
			return url.origin === "https://www.max.co.il" &&
				url.pathname === "/api/login/login" && response.request().method() === "POST";
		}, { timeout: 20000 }),
		page.click("app-user-login-form .send-me-code"),
	]);
	if (!response.ok()) {
		throw new Error("MAX_LOGIN_HTTP_" + response.status());
	}
	let data;
	try {
		data = await response.json();
	} catch {
		throw new Error("MAX_LOGIN_INVALID_JSON");
	}
	if (data?.ReturnCode !== 0 || data?.Result?.LoginStatus !== 0) {
		throw new Error("MAX_LOGIN_REJECTED_OR_VERIFICATION_REQUIRED");
	}
	return session;
}
`;

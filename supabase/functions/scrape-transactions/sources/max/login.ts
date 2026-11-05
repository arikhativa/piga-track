export async function login(
	username: string,
	password: string,
): Promise<string> {
	if (!username.trim() || !password.trim()) {
		throw new Error("MAX username and password are required");
	}

	const response = await fetch("https://www.max.co.il/api/login/login", {
		method: "POST",
		redirect: "error",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json, text/plain, */*",
			Origin: "https://www.max.co.il",
			Referer: "https://www.max.co.il/",
		},
		body: JSON.stringify({ username, password, id: null }),
	});

	if (!response.ok) {
		throw new Error(`MAX login failed: HTTP ${response.status}`);
	}

	try {
		await response.json();
	} catch {
		throw new Error(
			"MAX login returned non-JSON; browser verification may be required",
		);
	}

	const cookies = new Map<string, string>();
	for (const header of response.headers.getSetCookie()) {
		const pair = header.split(";", 1)[0];
		const separator = pair.indexOf("=");
		if (separator > 0) {
			cookies.set(pair.slice(0, separator), pair.slice(separator + 1));
		}
	}

	if (!cookies.get(".AUTHONLINE40V3")) {
		throw new Error("MAX login did not issue an authentication cookie");
	}

	return Array.from(cookies, ([name, value]) => `${name}=${value}`).join("; ");
}

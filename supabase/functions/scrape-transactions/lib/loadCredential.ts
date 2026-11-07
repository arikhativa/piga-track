import type { AutoSyncConf } from "@piga/db/schema";
import { eq } from "drizzle-orm";
import { pgSchema, text, uuid } from "drizzle-orm/pg-core";
import type { createDb } from "../../_shared/db.ts";

const decryptedSecrets = pgSchema("vault")
	.view("decrypted_secrets", {
		id: uuid("id"),
		decryptedSecret: text("decrypted_secret"),
	})
	.existing();

export async function loadCredential(
	db: ReturnType<typeof createDb>,
	source: Pick<AutoSyncConf, "credentials_secret_id">,
): Promise<Record<string, unknown>> {
	if (!source.credentials_secret_id) {
		throw new Error("Credentials unavailable");
	}

	const [secret] = await db
		.select({ value: decryptedSecrets.decryptedSecret })
		.from(decryptedSecrets)
		.where(eq(decryptedSecrets.id, source.credentials_secret_id))
		.limit(1);

	if (!secret?.value) {
		throw new Error("Credentials unavailable");
	}

	let credentials: unknown;
	try {
		credentials = JSON.parse(secret.value);
	} catch {
		// JSON parse errors can contain decrypted secret content.
		throw new Error("Credentials unavailable");
	}

	if (
		typeof credentials !== "object" ||
		credentials === null ||
		Array.isArray(credentials)
	) {
		throw new Error("Credentials unavailable");
	}

	return credentials as Record<string, unknown>;
}

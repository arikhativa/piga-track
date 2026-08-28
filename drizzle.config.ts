import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	schemaFilter: ["public"],
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: this is for local dev
		url: process.env.DATABASE_URL!,
	},
});

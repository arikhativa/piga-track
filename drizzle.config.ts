import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
	path: process.env.DRIZZLE_ENV === "prod" ? ".env.prod" : ".env",
	override: true,
});

export default defineConfig({
	out: "./supabase/migrations",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	schemaFilter: ["public"],
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: this is for local dev
		url: process.env.DATABASE_URL!,
	},
});

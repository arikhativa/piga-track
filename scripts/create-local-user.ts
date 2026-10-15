import { execFileSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const statusOutput = execFileSync("supabase", ["status", "-o", "json"], {
	encoding: "utf8",
});
const jsonStart = statusOutput.indexOf("{");
const jsonEnd = statusOutput.lastIndexOf("}");

if (jsonStart === -1 || jsonEnd === -1 || jsonStart > jsonEnd) {
	throw new Error("Could not parse output from `supabase status -o json`.");
}

const status = JSON.parse(statusOutput.slice(jsonStart, jsonEnd + 1)) as {
	SERVICE_ROLE_KEY?: string;
};

if (!status.SERVICE_ROLE_KEY) {
	throw new Error("`SERVICE_ROLE_KEY` was not found in `supabase status` output.");
}

const supabase = createClient(
	"http://127.0.0.1:54321",
	status.SERVICE_ROLE_KEY,
);

const { data, error } = await supabase.auth.admin.createUser({
	email: "yoavar@protonmail.com",
	password: "testYOAV",
	email_confirm: true,
});

if (error) {
	console.error(error);
	process.exit(1);
}

const user = data.user;

const { error: profileError } = await supabase.from("profile").insert({
	id: user.id,
	first_name: "יואב",
	last_name: "רבי",
	email: user.email!,
	default_currency_id: 7,
});

if (profileError) {
	console.error("Failed to create profile:", profileError);
	process.exit(1);
}

console.info(`Created user: ${user.email}`);
console.info(`User ID: ${user.id}`);

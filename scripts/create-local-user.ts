import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	"http://127.0.0.1:54321",
	"", // Note: this is the local secret
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
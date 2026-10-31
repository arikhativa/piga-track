import type { User } from "@supabase/supabase-js";
import type { UserIdentity } from "ra-core";
import { supabaseClient } from "#/lib/supabaseClient";

export async function getIdentity(user: User): Promise<UserIdentity> {
	const { data, error } = await supabaseClient
		.from("profile")
		.select("*")
		.eq("id", user.id)
		.single();

	if (error) {
		throw error;
	}

	if (!data) {
		throw new Error("Profile not found");
	}

	return {
		id: data.id,
		fullName: `${data.first_name} ${data.last_name}`,
	};
}

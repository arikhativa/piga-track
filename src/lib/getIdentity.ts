import type { User } from "@supabase/supabase-js";
import type { UserIdentity } from "ra-core";
import { setProfile } from "#/lib/profileStore";
import { supabaseClient } from "#/lib/supabaseClient";

export async function getIdentity(user: User): Promise<UserIdentity> {
	const { data, error } = await supabaseClient
		.from("profile")
		.select("id, first_name, last_name, email")
		.eq("id", user.id)
		.single();

	if (error) {
		throw error;
	}

	if (!data) {
		throw new Error("Profile not found");
	}

	setProfile({
		id: data.id,
		email: data.email,
		firstName: data.first_name,
		lastName: data.last_name,
	});

	return {
		id: data.id,
		fullName: `${data.first_name} ${data.last_name}`,
	};
}

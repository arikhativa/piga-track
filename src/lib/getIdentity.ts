import type { User } from "@supabase/supabase-js";
import type { UserIdentity } from "ra-core";
import { setProfile } from "#/lib/profileStore";
import { supabaseClient } from "#/lib/supabaseClient";

export async function getIdentity(user: User): Promise<UserIdentity> {
	const {
		data: { session },
		error: sessionError,
	} = await supabaseClient.auth.getSession();

	console.log("getIdentity user:", user);
	console.log("getIdentity session:", session);
	console.log("getIdentity session error:", sessionError);

	const { data, error } = await supabaseClient
		.from("profile")
		.select("id, first_name, last_name, email")
		.eq("id", user.id)
		.single();

	console.log("profile result:", { data, error });

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

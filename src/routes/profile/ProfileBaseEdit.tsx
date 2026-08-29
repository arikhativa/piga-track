import { EditBase } from "ra-core";
import { useProfile } from "#/hooks/use-profile";
import { ProfileForm } from "#/routes/profile/ProfileForm";

export function ProfileBaseEdit() {
	const { data: profile } = useProfile();

	if (!profile) return null;

	return (
		<EditBase resource="profile" id={profile.id}>
			<ProfileForm />
		</EditBase>
	);
}

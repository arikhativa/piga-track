import { ProfileForm } from "#/routes/profile/ProfileForm";
import { Edit } from "@/components/admin";

export function ProfileEdit() {
	return (
		<Edit>
			<ProfileForm />
		</Edit>
	);
}

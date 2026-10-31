import { EditBase } from "ra-core";
import { useProfile } from "#/hooks/use-profile";
import { DefaultsForm } from "#/routes/defaults/DefaultsForm";

export function DefaultsBaseEdit() {
	const { data: profile } = useProfile();

	if (!profile) return null;

	return (
		<EditBase resource="profile" redirect={false} id={profile.id}>
			<DefaultsForm />
		</EditBase>
	);
}

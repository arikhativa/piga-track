import { required } from "ra-core";
import { SimpleForm, TextInput } from "@/components/admin";

export function ProfileForm() {
	return (
		<SimpleForm>
			<TextInput source="first_name" label="First name" validate={required()} />

			<TextInput source="last_name" label="Last name" validate={required()} />
		</SimpleForm>
	);
}

import { email, maxLength, required } from "ra-core";
import { SimpleForm, TextInput } from "@/components/admin";

export function ProfileForm() {
	return (
		<SimpleForm>
			<TextInput source="first_name" label="First name" validate={required()} />

			<TextInput source="last_name" label="Last name" validate={required()} />

			<TextInput source="email" type="email" validate={[required(), email()]} />

			<TextInput source="credit_card" validate={maxLength(8)} />
		</SimpleForm>
	);
}

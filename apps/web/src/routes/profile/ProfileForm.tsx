import { email, required } from "ra-core";
import { SimpleForm, TextArrayInput, TextInput } from "@/components/admin";

export function ProfileForm() {
	return (
		<SimpleForm>
			<TextInput source="first_name" label="First name" validate={required()} />

			<TextInput source="last_name" label="Last name" validate={required()} />

			<TextInput source="email" type="email" validate={[required(), email()]} />

			<TextArrayInput
				source="credit_card"
				label="Credit cards"
				helperText="Press Enter to add each card. Maximum 8 characters per card."
				validate={(cards: string[] | null) =>
					cards?.some((card) => card.length > 8)
						? "Each credit card must be at most 8 characters."
						: undefined
				}
			/>
		</SimpleForm>
	);
}

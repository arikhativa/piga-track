import {
	type EnumLabelGroup,
	type EnumLabelValue,
	getEnumLabel,
} from "#/lib/enum-labels";
import { SelectInput } from "@/components/admin";

type EnumSelectInputProps<Group extends EnumLabelGroup> = {
	source: string;
	labelGroup: Group;
	values: readonly EnumLabelValue<Group>[];
	label?: string;
};

export function EnumSelectInput<Group extends EnumLabelGroup>({
	source,
	labelGroup,
	values,
	label,
}: EnumSelectInputProps<Group>) {
	return (
		<SelectInput
			source={source}
			label={label}
			choices={values.map((value) => ({
				id: value,
				name: getEnumLabel(labelGroup, value),
			}))}
		/>
	);
}

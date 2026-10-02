import type { ChoicesProps, InputProps } from "ra-core";
import { FieldTitle, useChoicesContext, useCreate, useInput } from "ra-core";
import { DynamicSelect } from "#/components/custom-ui/DynamicSelect";
import { FormError, FormField, FormLabel } from "@/components/admin/form";
import { InputHelperText } from "@/components/admin/input-helper-text";

type DynamicSelectInputProps = ChoicesProps &
	Partial<InputProps> & {
		label?: string;
		optionText?: string;
		emptyText?: string;
	};

export function DynamicSelectInput({
	optionText = "name",
	emptyText = "Select...",
	label,
	helperText,
	...props
}: DynamicSelectInputProps) {
	const { allChoices = [], isPending, source, resource } = useChoicesContext();

	const { id, field, isRequired } = useInput({
		...props,
		source,
		resource,
		label,
		helperText,
	});

	const [create] = useCreate();

	const handleCreate = async (value: string) => {
		const record = await create(
			resource,
			{
				data: { value },
			},
			{
				returnPromise: true,
			},
		);

		return record.id;
	};

	return (
		<FormField id={id} name={field.name} className="w-full min-w-20">
			{label !== "" && (
				<FormLabel>
					<FieldTitle
						label={label}
						source={source}
						resource={resource}
						isRequired={isRequired}
					/>
				</FormLabel>
			)}

			<DynamicSelect
				choices={allChoices}
				value={field.value}
				onChange={field.onChange}
				optionText={optionText}
				emptyText={emptyText}
				isPending={isPending}
				disabled={field.disabled}
				onCreate={handleCreate}
			/>

			<InputHelperText helperText={helperText} />
			<FormError />
		</FormField>
	);
}

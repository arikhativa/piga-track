import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { DynamicSelectInput } from "#/components/form/DynamicSelectInput";
import { categoryOptionText } from "#/lib/form/categoryOptionText";
import { ReferenceInput, SelectInput } from "@/components/admin";

type CategorySelectInputProps = Omit<
	ComponentProps<typeof SelectInput>,
	"source" | "choices"
> & {
	source?: string;
};

export function CategorySelectInput({
	source = "category_id",
	label = "Category",
	...props
}: CategorySelectInputProps) {
	return (
		<ReferenceInput
			source={source}
			reference="transaction_category"
			filter={{ "parent_id@is": null }}
			sort={{ field: "value", order: "ASC" }}
			perPage={1000}
		>
			<SelectInput
				label={label}
				optionText={categoryOptionText}
				parse={(value) => (value === "" ? null : value)}
				{...props}
			/>
		</ReferenceInput>
	);
}

type ChildCategorySelectInputProps = CategorySelectInputProps & {
	parentSource?: string;
};

export function ChildCategorySelectInput({
	source = "sub_category_id",
	parentSource = "category_id",
	label = "Subcategory",
	disabled,
	...props
}: ChildCategorySelectInputProps) {
	const { parentId, hasParent } = useCategoryParent(source, parentSource);

	return (
		<ReferenceInput
			source={source}
			reference="transaction_category"
			filter={{ parent_id: hasParent ? parentId : -1 }}
			enableGetChoices={() => hasParent}
			sort={{ field: "value", order: "ASC" }}
			perPage={1000}
		>
			<SelectInput
				label={label}
				optionText={categoryOptionText}
				parse={(value) => (value === "" ? null : value)}
				disabled={disabled || !hasParent}
				helperText={!hasParent ? "Select a category first." : undefined}
				{...props}
			/>
		</ReferenceInput>
	);
}

function useCategoryParent(source: string, parentSource: string) {
	const parentId = useWatch({ name: parentSource });
	const hasParent = parentId != null && parentId !== "";
	const previousParentId = useRef(parentId);
	const { setValue } = useFormContext();

	useEffect(() => {
		if (previousParentId.current !== parentId) {
			setValue(source, null, { shouldDirty: true, shouldValidate: true });
			previousParentId.current = parentId;
		}
	}, [parentId, setValue, source]);

	return { parentId, hasParent };
}

type DynamicCategorySelectInputProps = Omit<
	ComponentProps<typeof DynamicSelectInput>,
	"source" | "choices" | "createData"
> & { source?: string };

export function DynamicCategorySelectInput({
	source = "category_id",
	label = "Category",
	...props
}: DynamicCategorySelectInputProps) {
	return (
		<ReferenceInput
			source={source}
			reference="transaction_category"
			filter={{ "parent_id@is": null }}
			sort={{ field: "value", order: "ASC" }}
			perPage={1000}
		>
			<DynamicSelectInput
				label={label}
				optionText="value"
				emptyText="Category"
				parse={(value) => (value === "" ? null : value)}
				{...props}
				createData={{ parent_id: null }}
			/>
		</ReferenceInput>
	);
}

export function DynamicChildCategorySelectInput({
	source = "sub_category_id",
	parentSource = "category_id",
	label = "Subcategory",
	disabled,
	...props
}: DynamicCategorySelectInputProps & { parentSource?: string }) {
	const { parentId, hasParent } = useCategoryParent(source, parentSource);

	return (
		<ReferenceInput
			source={source}
			reference="transaction_category"
			filter={{ parent_id: hasParent ? parentId : -1 }}
			enableGetChoices={() => hasParent}
			sort={{ field: "value", order: "ASC" }}
			perPage={1000}
		>
			<DynamicSelectInput
				label={label}
				optionText="value"
				emptyText="Subcategory"
				parse={(value) => (value === "" ? null : value)}
				{...props}
				disabled={disabled || !hasParent}
				createData={{ parent_id: parentId }}
			/>
		</ReferenceInput>
	);
}

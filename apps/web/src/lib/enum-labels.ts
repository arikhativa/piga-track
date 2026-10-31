export const enumLabels = {
	classificationRuleAction: {
		addData: "Add data",
		dropRow: "Drop row",
	},
} as const;

export type EnumLabelGroup = keyof typeof enumLabels;
export type EnumLabelValue<Group extends EnumLabelGroup> =
	keyof (typeof enumLabels)[Group] & string;

export function getEnumLabel<Group extends EnumLabelGroup>(
	group: Group,
	value: EnumLabelValue<Group>,
) {
	return enumLabels[group][value];
}

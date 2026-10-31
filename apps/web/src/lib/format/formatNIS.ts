// TODO use this in any ₪ place
export const formatNIS = (value: number) =>
	`${new Intl.NumberFormat("he-IL", {
		maximumFractionDigits: 0,
	}).format(value)} ₪`;

export const formatCurrency = (value: number) => {
	return new Intl.NumberFormat("he-IL", {
		maximumFractionDigits: 0,
	}).format(value);
};

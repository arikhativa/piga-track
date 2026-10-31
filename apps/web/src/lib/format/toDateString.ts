export function toDateString(date: Date | string) {
	return new Date(date).toISOString().split("T")[0];
}

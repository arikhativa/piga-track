export function toSmallDate(date: string | Date) {
	return new Date(date)
		.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit",
		})
		.replaceAll("/", ".");
}

export function toTime(date: string | Date) {
	return new Date(date).toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

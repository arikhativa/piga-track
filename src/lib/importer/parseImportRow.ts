import type { ImportProfile, ImportRowData } from "#/db/schema";
import { toDateStringFromDMY } from "#/lib/format/toDateStringFromDMY";

function columnToIndex(column: string): number {
	let index = 0;

	for (const char of column.toUpperCase()) {
		index = index * 26 + char.charCodeAt(0) - 64;
	}

	return index - 1;
}

function getValue(row: unknown[], column: string | null): string | null {
	if (!column) {
		return null;
	}

	const value = row[columnToIndex(column)];

	if (value === null || value === undefined) {
		return null;
	}

	return String(value).trim() || null;
}

export function parseImportRow(
	table: unknown[][],
	profile: ImportProfile,
): ImportRowData[] {
	const startIndex = Math.max((profile.start_row ?? 1) - 1, 0);

	return table.slice(startIndex).map((row, index) => {
		const baseDate = getValue(row, profile.date_column);
		const date = toDateStringFromDMY(baseDate || "");
		const positive = getValue(row, profile.positive_amount_column);
		const negative = getValue(row, profile.negative_amount_column);

		let amount: string | null = null;

		if (positive) {
			amount = positive;
		} else if (negative) {
			amount = `-${negative}`;
		}

		return {
			row_number: startIndex + index + 1,
			date,
			amount,
			tag_value: getValue(row, profile.tag_column),
			description: getValue(row, profile.description_column),
			category_id: null,
			project_id: null,
		};
	});
}

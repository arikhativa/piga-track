import type { ImportProfile, ImportRowData } from "#/db/schema";
import { drizzleTextArray } from "#/lib/format/drizzleTextArray";

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

function getDescription(
	row: unknown[],
	columns: string[] | null,
): string | null {
	if (!columns?.length) {
		return null;
	}

	const values = columns
		.map((column) => getValue(row, column))
		.filter((value): value is string => value !== null);

	return values.length ? values.join(" | ") : null;
}

function getAmount(
	row: unknown[],
	profile: ImportProfile,
): string | null {
	const positive = getValue(row, profile.positive_amount_column);
	const negative = getValue(row, profile.negative_amount_column);

	const sameColumn = profile.positive_amount_column &&
		profile.positive_amount_column === profile.negative_amount_column;

	if (sameColumn) {
		const value = positive; // negative is the same

		if (!value) {
			return null;
		}

		const number = Number(value);

		if (Number.isNaN(number)) {
			return null;
		}

		// if the received amount is marked with negative
		if (profile.positive_amount_sign) {
			return number.toString();
		}

		// if the received amount is marked with positive
		return (number * -1).toString();
	}

	if (positive) {
		const number = Number(positive);

		// if the received amount is marked with negative
		if (profile.positive_amount_sign) {
			return number.toString();
		}
		return (number * -1).toString();
	}

	if (negative) {
		const number = Number(negative);

		// if the spent amount is marked with negative
		if (profile.negative_amount_sign) {
			return (number * -1).toString();
		}
		return number.toString();
	}

	return null;
}

export function toDateStringGeneric(value: string): string | null {
	const input = value.trim();

	if (!input) {
		return null;
	}

	const parts = input.split(/[\/.-]/).map(Number);

	if (parts.length !== 3 || parts.some(Number.isNaN)) {
		return null;
	}

	let day: number;
	let month: number;
	let year: number;

	if (parts[0] > 31) {
		// YYYY-MM-DD
		[year, month, day] = parts;
	} else {
		// DD/MM/YYYY or DD-MM-YYYY
		[day, month, year] = parts;
	}

	if (
		year < 1000 ||
		month < 1 ||
		month > 12 ||
		day < 1 ||
		day > 31
	) {
		return null;
	}

	const date = new Date(Date.UTC(year, month - 1, day));

	// Reject impossible dates such as 31/02/2026.
	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== month - 1 ||
		date.getUTCDate() !== day
	) {
		return null;
	}

	return date.toISOString().slice(0, 10);
}

function isEmptyRow(
	row: unknown[],
	profile: ImportProfile,
): boolean {
	const columns = [
		profile.date_column,
		profile.positive_amount_column,
		profile.negative_amount_column,
		profile.tag_column,
		...drizzleTextArray(profile.description_column_list),
	].filter((column): column is string => Boolean(column));

	return columns.every((column) => {
		const value = row[columnToIndex(column)];

		return (
			value === null ||
			value === undefined ||
			String(value).trim() === ""
		);
	});
}

export function parseImportRow(
	table: unknown[][],
	profile: ImportProfile,
): ImportRowData[] {
	const startIndex = Math.max((profile.start_row ?? 1) - 1, 0);
	const rows: ImportRowData[] = [];

	for (let index = startIndex; index < table.length; index++) {
		const row = table[index];

		if (isEmptyRow(row, profile)) {
			break;
		}

		const baseDate = getValue(row, profile.date_column);
		const date = toDateStringGeneric(baseDate || "");

		rows.push({
			row_number: index + 1,
			date,
			amount: getAmount(row, profile),
			description: getDescription(
				row,
				drizzleTextArray(profile.description_column_list),
			),
			category_id: null,
			project_id: null,
		});
	}

	return rows;
}

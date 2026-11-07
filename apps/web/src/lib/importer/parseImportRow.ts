import type { ImportProfile, ImportRowData, Profile } from "@piga/db/types";
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

function formatAmount(value: string | null): number | null {
	if (value === null) {
		return null;
	}

	const cleaned = value
		.trim()
		.replace(/,/g, "")
		.replace(/[^\d.-]/g, "");

	if (!cleaned) {
		return null;
	}

	const amount = Number(cleaned);
	return Number.isFinite(amount) ? amount : null;
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

function getAmount(row: unknown[], profile: ImportProfile): string | null {
	const positive = formatAmount(getValue(row, profile.positive_amount_column));
	const negative = formatAmount(getValue(row, profile.negative_amount_column));

	const sameColumn =
		profile.positive_amount_column &&
		profile.positive_amount_column === profile.negative_amount_column;

	if (sameColumn) {
		if (positive === null) {
			return null;
		}

		// if the received amount is marked with negative
		if (profile.positive_amount_sign) {
			return positive.toString();
		}

		// if the received amount is marked with positive
		return (positive * -1).toString();
	}

	if (positive !== null && positive !== 0) {
		const number = Number(positive);

		// if the received amount is marked with negative
		if (profile.positive_amount_sign) {
			return number.toString();
		}
		return (number * -1).toString();
	}

	if (negative !== null && negative !== 0) {
		// if the spent amount is marked with negative
		if (profile.negative_amount_sign) {
			return (negative * -1).toString();
		}
		return negative.toString();
	}

	if (positive !== null) {
		return (profile.positive_amount_sign ? positive : positive * -1).toString();
	}

	if (negative !== null) {
		return (profile.negative_amount_sign ? negative * -1 : negative).toString();
	}

	return null;
}

export function toDateStringGeneric(value: string): string | null {
	const input = value.trim();

	if (!input) {
		return null;
	}

	const parts = input.split(/[/.-]/).map(Number);

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
		// DD/MM/YY or DD/MM/YYYY
		[day, month, year] = parts;
		if (year < 100) year += 2000;
	}

	if (month < 1 || month > 12 || day < 1 || day > 31) {
		return null;
	}

	const date = new Date(Date.UTC(year, month - 1, day));

	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== month - 1 ||
		date.getUTCDate() !== day
	) {
		return null;
	}

	return date.toISOString().slice(0, 10);
}

function isEmptyRow(row: unknown[], profile: ImportProfile): boolean {
	const columns = [
		profile.date_column,
		profile.positive_amount_column,
		profile.negative_amount_column,
		...drizzleTextArray(profile.description_column_list),
	].filter((column): column is string => Boolean(column));

	return columns.every((column) => {
		const value = row[columnToIndex(column)];

		if (value === null || value === undefined || String(value).trim() === "") {
			return true;
		}

		if (
			column === profile.positive_amount_column ||
			column === profile.negative_amount_column
		) {
			const amount = Number(String(value).replace(/[^\d.-]/g, ""));
			return Number.isFinite(amount) && amount === 0;
		}

		return false;
	});
}

export function parseImportRow(
	table: unknown[][],
	importProfile: ImportProfile,
	userProfiles: Pick<Profile, "id" | "credit_card">[],
): ImportRowData[] {
	const profileIdsByCreditCard = new Map<string, string | null>();
	for (const userProfile of userProfiles) {
		for (const card of userProfile.credit_card ?? []) {
			const creditCard = card.trim();
			if (!creditCard) continue;

			// A card shared by multiple profiles cannot identify a single owner.
			if (
				profileIdsByCreditCard.has(creditCard) &&
				profileIdsByCreditCard.get(creditCard) !== userProfile.id
			) {
				profileIdsByCreditCard.set(creditCard, null);
			} else {
				profileIdsByCreditCard.set(creditCard, userProfile.id);
			}
		}
	}
	const startIndex = Math.max((importProfile.start_row ?? 1) - 1, 0);
	const rows: ImportRowData[] = [];

	for (let index = startIndex; index < table.length; index++) {
		const row = table[index];

		if (isEmptyRow(row, importProfile)) {
			break;
		}

		const baseDate = getValue(row, importProfile.date_column);
		const date = toDateStringGeneric(baseDate || "");

		const parsedAmount = getAmount(row, importProfile);
		if (parsedAmount !== null && Number(parsedAmount) === 0) {
			continue;
		}

		const amount = parsedAmount || "";
		const creditCard = getValue(row, importProfile.credit_card_column);

		rows.push({
			profile_id: creditCard
				? (profileIdsByCreditCard.get(creditCard) ?? null)
				: null,
			date,
			amount,
			description: getDescription(
				row,
				drizzleTextArray(importProfile.description_column_list),
			),
			category_id: null,
			project_id: null,
		});
	}

	return rows;
}

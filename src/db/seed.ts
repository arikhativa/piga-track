import { randomInt, randomUUID } from "node:crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import {
	profile,
	transaction,
	transactionCategory,
	transactionProject,
	transactionTag,
	transactionType,
} from "./schema";
import "dotenv/config";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });

const profileId = randomUUID();

async function seedTransactions() {
	const transactions = Array.from({ length: 200 }, (_, i) => {
		const transactionAt = new Date(
			Date.now() - randomInt(0, 90 * 24 * 60 * 60 * 1000),
		);

		const cents = i % 2 === 0 ? randomInt(1, 500001) : -randomInt(1, 500001);

		const amount = (cents / 100).toFixed(2);

		return {
			profile_id: profileId,
			amount,
			amount_nis: amount,
			currency_id: 7,
			transaction_type_id: randomInt(1, 6),
			category_id: [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15][
				randomInt(0, 13)
			],
			tag_id: null,
			project_id: null,
			description: `Test transaction ${randomUUID().slice(0, 8)}`,
			transaction_at: transactionAt,
		};
	});

	await db.insert(transaction).values(transactions);
}
async function seed() {
	await db
		.insert(transactionType)
		.values([
			{ id: 1, name: "Cash", base: 0 },
			{ id: 2, name: "Bit", base: 0 },
			{ id: 3, name: "Credit Card", base: 0 },
			{ id: 4, name: "Bank Transfer", base: 0 },
			{ id: 5, name: "Paybox", base: 0 },
		])
		.onConflictDoNothing();

	await db
		.insert(transactionProject)
		.values([
			{
				id: 1,
				value: "יוון",
				created_at: new Date("2026-08-30T13:27:33.844Z"),
			},
			{ id: 2, value: "נחל", created_at: new Date("2026-09-18T07:36:58.432Z") },
			{
				id: 3,
				value: "לבטל",
				created_at: new Date("2026-10-13T16:40:08.31056Z"),
			},
		])
		.onConflictDoNothing();

	await db
		.insert(transactionTag)
		.values([
			{ id: 1, value: "ירקות" },
			{ id: 2, value: "פירות" },
			{ id: 3, value: "ביצים" },
			{ id: 4, value: "יבשים" },
			{ id: 5, value: "טיסה" },
			{ id: 6, value: "ביטוח" },
			{ id: 7, value: "השכרת רכב" },
			{ id: 8, value: "גוד פארם" },
			{ id: 9, value: "סים" },
			{ id: 10, value: "מטרו" },
			{ id: 11, value: "מסעדה" },
			{ id: 12, value: "קפה" },
			{ id: 13, value: "לינה" },
			{ id: 14, value: "אוכל" },
			{ id: 15, value: "קרם" },
			{ id: 16, value: "בירה" },
			{ id: 17, value: "מים" },
			{ id: 18, value: "מתנה" },
			{ id: 19, value: "חטיף" },
			{ id: 20, value: "כביש אגרה" },
			{ id: 21, value: "אביזרי ים" },
			{ id: 22, value: "סופר" },
			{ id: 23, value: "כובע" },
			{ id: 24, value: "בית מרקחת" },
			{ id: 25, value: "אתר תיירות" },
			{ id: 26, value: "שופינג" },
			{ id: 27, value: "דלק" },
			{ id: 28, value: "גבינות" },
			{ id: 29, value: "ירקות" },
			{ id: 30, value: "פירות" },
			{ id: 31, value: "ביצים" },
			{ id: 32, value: "שיעור פרטי" },
			{ id: 33, value: "יין" },
			{ id: 34, value: "וולט" },
		])
		.onConflictDoNothing();

	await db
		.insert(transactionCategory)
		.values([
			{ id: 1, value: "אוכל לבית ופארם", is_income: false, is_expense: true },
			{ id: 2, value: "בילויים", is_income: false, is_expense: true },
			{ id: 4, value: "בריאות", is_income: false, is_expense: true },
			{ id: 5, value: "חשבונות", is_income: false, is_expense: true },
			{ id: 6, value: "רכב", is_income: false, is_expense: true },
			{ id: 7, value: "תחבצ", is_income: false, is_expense: true },
			{ id: 8, value: "תחזוקת בית", is_income: false, is_expense: true },
			{ id: 9, value: "קפה, מסעדות וברים", is_income: false, is_expense: true },
			{ id: 10, value: "טיפוח ופנאי", is_income: false, is_expense: true },
			{ id: 11, value: "קניות", is_income: false, is_expense: true },
			{ id: 12, value: "מתנות", is_income: true, is_expense: true },
			{ id: 13, value: "שונות", is_income: false, is_expense: true },
			{ id: 14, value: "משכורת", is_income: true, is_expense: false },
			{ id: 15, value: "שכר דירה", is_income: true, is_expense: true },
		])
		.onConflictDoNothing();

	await db.insert(profile).values({
		id: profileId,
		first_name: "Test",
		last_name: "User",
		email: `test-${profileId}@example.com`,
		default_currency_id: 7,
		default_transaction_type_id: 1,
		default_category_id: null,
		default_project_id: null,
	});

	await db
		.insert(schema.importProfile)
		.values([
			{
				id: 1,
				name: "מקס",
				currency_id: 7,
				start_row: 5,
				date_column: "a",
				positive_amount_column: "f",
				negative_amount_column: "f",
				description_column_list: ["b", "c"],
				created_at: new Date("2026-09-13T10:38:57.675792Z"),
				updated_at: new Date("2026-09-13T10:38:57.675792Z"),
				positive_amount_sign: false,
				negative_amount_sign: true,
				transaction_type_id: 3,
			},
			{
				id: 2,
				name: "בינלאומי",
				currency_id: 7,
				start_row: 8,
				date_column: "c",
				positive_amount_column: "d",
				negative_amount_column: "e",
				description_column_list: ["f"],
				created_at: new Date("2026-09-13T10:39:25.717208Z"),
				updated_at: new Date("2026-09-13T10:39:25.717208Z"),
				positive_amount_sign: true,
				negative_amount_sign: true,
				transaction_type_id: 4,
			},
			{
				id: 3,
				name: "כאל",
				currency_id: 7,
				start_row: 3,
				date_column: "A",
				positive_amount_column: "C",
				negative_amount_column: "C",
				description_column_list: ["B"],
				created_at: new Date("2026-10-14T17:21:57.533924Z"),
				updated_at: new Date("2026-10-14T17:21:57.533924Z"),
				positive_amount_sign: false,
				negative_amount_sign: true,
				transaction_type_id: 4,
			},
		])
		.onConflictDoNothing();

	await seedTransactions();

	console.log("Seed completed");
}

async function main() {
	try {
		await seed();
	} finally {
		await client.end();
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

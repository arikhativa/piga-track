import type { InferSelectModel } from "drizzle-orm";
import {
	date,
	integer,
	numeric,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const NIS_ID = 7 as const; // NOTE: this is nis - it will be in DB cus there is a mig before this
const CASH_ID = 1 as const; // NOTE: this is cash - there is a custom mig for this
const MARKET_ID = 1 as const; // NOTE: defend here supabase/migrations/0013_init_category.sql

const AMOUNT = numeric("amount", {
	precision: 12,
	scale: 2,
});

export const profile = pgTable("profile", {
	id: uuid("id").primaryKey(),

	first_name: text("first_name").notNull(),
	last_name: text("last_name").notNull(),
	email: text("email").notNull().unique(),

	default_currency_id: integer("default_currency_id")
		.notNull()
		.default(NIS_ID)
		.references(() => currency.id),

	default_transaction_type_id: integer("default_transaction_type_id")
		.notNull()
		.default(CASH_ID)
		.references(() => transactionType.id),

	default_category_id: integer("default_category_id").references(
		() => transactionCategory.id,
	),

	default_project_id: integer("default_project_id").references(
		() => transactionProject.id,
	),
});

export const transactionTag = pgTable("transaction_tag", {
	id: serial("id").primaryKey(),
	value: text("value").notNull(),
});

export const transactionProject = pgTable("transaction_project", {
	id: serial("id").primaryKey(),
	value: text("value").notNull(),

	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const transactionCategory = pgTable("transaction_category", {
	id: serial("id").primaryKey(),
	value: text("value").notNull(),
});

export const currency = pgTable("currency", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	iso_code: text("iso_code").notNull().unique(),
	symbol: text("symbol").notNull(),
});

export const exchangeRate = pgTable(
	"exchange_rate",
	{
		isoCode: text("iso_code")
			.notNull()
			.references(() => currency.iso_code),

		date: date("date").notNull(),

		rate: numeric("rate", {
			precision: 12,
			scale: 6,
		}).notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.date, table.isoCode],
		}),
	],
);

export const transactionType = pgTable("transaction_type", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	base: integer("base").default(0).notNull(),
});

export const transaction = pgTable("transaction", {
	id: serial("id").primaryKey(),

	profile_id: uuid("profile_id")
		.notNull()
		.references(() => profile.id),

	tag_id: integer("tag_id").references(() => transactionTag.id),

	project_id: integer("project_id").references(() => transactionProject.id),

	category_id: integer("category_id")
		.default(MARKET_ID)
		.references(() => transactionCategory.id),

	currency_id: integer("currency_id")
		.notNull()
		.default(NIS_ID)
		.references(() => currency.id),

	transaction_type_id: integer("transaction_type_id")
		.notNull()
		.default(CASH_ID)
		.references(() => transactionType.id),

	amount: AMOUNT.notNull(),

	description: text("description"),

	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updated_at: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

// ============================================================================
//	Import
// ============================================================================

export const importProfile = pgTable("import_profile", {
	id: serial("id").primaryKey(),

	name: text("name").notNull(),

	currency_id: integer("currency_id")
		.notNull()
		.default(NIS_ID)
		.references(() => currency.id),

	start_row: integer("start_row"),

	date_column: text("date_column"),

	positive_amount_column: text("positive_amount_column"),

	negative_amount_column: text("negative_amount_column"),

	tag_column: text("tag_column"),

	description_column: text("description_column"),

	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updated_at: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const importBatchStatusEnum = pgEnum("import_batch_status", [
	"draft",
	"approved",
	"cancelled",
]);

export const importBatch = pgTable("import_batch", {
	id: serial("id").primaryKey(),

	import_profile_id: integer("import_profile_id")
		.notNull()
		.references(() => importProfile.id),

	batch_name: text("batch_name").notNull(),

	status: importBatchStatusEnum("status").notNull().default("draft"),

	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updated_at: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const importRowStatusEnum = pgEnum("import_row_status", [
	"pending",
	"merged",
	"dropped",
]);

export const importRow = pgTable("import_row", {
	id: serial("id").primaryKey(),

	import_batch_id: integer("import_batch_id")
		.notNull()
		.references(() => importBatch.id),

	row_number: integer("row_number").notNull(),

	date: date("date"),

	amount: AMOUNT,

	description: text("description"),

	tag_id: integer("tag_id").references(() => transactionTag.id),

	category_id: integer("category_id").references(() => transactionCategory.id),

	project_id: integer("project_id").references(() => transactionProject.id),

	status: importRowStatusEnum("status").notNull().default("pending"),

	transaction_id: integer("transaction_id").references(() => transaction.id),

	duplicate_transaction_id: integer("duplicate_transaction_id").references(
		() => transaction.id,
	),

	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updated_at: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

// ============================================================================
//	Types
// ============================================================================

export type ImportBatchStatusEnum =
	(typeof importBatchStatusEnum.enumValues)[number];
export type ImportRow = InferSelectModel<typeof importRow>;
export type ImportBatch = InferSelectModel<typeof importBatch>;
export type ImportProfile = InferSelectModel<typeof importProfile>;
export type ExchangeRate = InferSelectModel<typeof exchangeRate>;
export type TransactionCategory = InferSelectModel<typeof transactionCategory>;
export type TransactionTag = InferSelectModel<typeof transactionTag>;
export type TransactionProject = InferSelectModel<typeof transactionProject>;
export type TransactionType = InferSelectModel<typeof transactionType>;
export type Profile = InferSelectModel<typeof profile>;
export type Currency = InferSelectModel<typeof currency>;
export type Transaction = InferSelectModel<typeof transaction>;

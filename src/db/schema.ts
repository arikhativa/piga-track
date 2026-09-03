import type { InferSelectModel } from "drizzle-orm";
import {
	integer,
	numeric,
	pgTable,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

const NIS_ID = 7 as const; // NOTE: this is nis - it will be in DB cus there is a mig before this
const CASH_ID = 1 as const; // NOTE: this is cash - there is a custom mig for this
const MARKET_ID = 1 as const; // NOTE: defend here supabase/migrations/0013_init_category.sql

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

	amount: numeric("amount", {
		precision: 12,
		scale: 2,
	}).notNull(),

	description: text("description"),

	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updated_at: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type TransactionCategory = InferSelectModel<typeof transactionCategory>;
export type TransactionTag = InferSelectModel<typeof transactionTag>;
export type TransactionProject = InferSelectModel<typeof transactionProject>;
export type TransactionType = InferSelectModel<typeof transactionType>;
export type Profile = InferSelectModel<typeof profile>;
export type Currency = InferSelectModel<typeof currency>;
export type Transaction = InferSelectModel<typeof transaction>;

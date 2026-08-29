import type { InferSelectModel } from "drizzle-orm";
import {
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const profile = pgTable("profile", {
	id: uuid("id").primaryKey(),

	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
});

export const transactionTag = pgTable("transaction_tag", {
	id: serial("id").primaryKey(),
	value: text("value").notNull(),
});

export const transactions = pgTable("transaction", {
	id: serial("id").primaryKey(),

	profile_id: uuid("profile_id")
		.notNull()
		.references(() => profile.id),

	tagId: integer("tag_id").references(() => transactionTag.id),

	amount: integer("amount").notNull(),
	description: text("description"),

	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updated_at: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Transaction = InferSelectModel<typeof transactions>;

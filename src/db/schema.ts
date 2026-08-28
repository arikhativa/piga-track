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

export const transactions = pgTable("transaction", {
	id: serial("id").primaryKey(),

	profileId: uuid("profile_id")
		.notNull()
		.references(() => profile.id),

	amount: integer("amount").notNull(),
	description: text("description").notNull(),

	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const profiles = pgTable("profile", {
	id: uuid("id").primaryKey(),

	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
});

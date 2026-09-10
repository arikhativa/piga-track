import "@supabase/functions-js/edge-runtime.d.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const NIS_ID = 7 as const; // NOTE: this is nis - it will be in DB cus there is a mig before this
const CASH_ID = 1 as const; // NOTE: this is cash - there is a custom mig for this
const MARKET_ID = 1 as const; // NOTE: defend here supabase/migrations/0013_init_category.sql

const AMOUNT = numeric("amount", {
  precision: 12,
  scale: 2,
});

const profile = pgTable("profile", {
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

const transactionTag = pgTable("transaction_tag", {
  id: serial("id").primaryKey(),
  value: text("value").notNull(),
});

const transactionProject = pgTable("transaction_project", {
  id: serial("id").primaryKey(),
  value: text("value").notNull(),

  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

const transactionCategory = pgTable("transaction_category", {
  id: serial("id").primaryKey(),
  value: text("value").notNull(),
});

const currency = pgTable("currency", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  iso_code: text("iso_code").notNull().unique(),
  symbol: text("symbol").notNull(),
});

const transactionType = pgTable("transaction_type", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  base: integer("base").default(0).notNull(),
});

const transaction = pgTable("transaction", {
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

const importProfile = pgTable("import_profile", {
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

const importBatchStatusEnum = pgEnum("import_batch_status", [
  "draft",
  "approved",
  "cancelled",
]);

const importBatch = pgTable("import_batch", {
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

const importRowStatusEnum = pgEnum("import_row_status", [
  "pending",
  "merged",
  "dropped",
]);

const importRow = pgTable("import_row", {
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

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const importRowSchema = z.object({
  row_number: z.number().int().positive(),
  date: z.string().nullable(),
  amount: z.string().nullable(),
  tag_value: z.string().nullable(),
  description: z.string().nullable(),
  category_id: z.number().int().nullable().optional(),
  project_id: z.number().int().nullable().optional(),
});

const createImportBatchSchema = z.object({
  batch_name: z.string().trim().min(1),
  import_profile_id: z.number().int().positive(),
  rows: z.array(importRowSchema),
});

Deno.serve(async (req) => {
  try {
    const connectionString = Deno.env.get("DATABASE_URL")!;

    const client = postgres(connectionString, { prepare: false });
    const db = drizzle({ client });

    const body = createImportBatchSchema.parse(await req.json());

    const result = await db.transaction(async (tx) => {
      const [batch] = await tx
        .insert(importBatch)
        .values({
          batch_name: body.batch_name,
          import_profile_id: body.import_profile_id,
        })
        .returning();

      const rows = body.rows.length
        ? await tx
          .insert(importRow)
          .values(
            body.rows.map((row) => ({
              ...row,
              import_batch_id: batch.id,
            })),
          )
          .returning()
        : [];

      return { batch, rows };
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "Invalid request",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error(error);

    return Response.json(
      { error: "Failed to create import batch" },
      { status: 500 },
    );
  }
});

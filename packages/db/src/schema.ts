import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import {
	boolean,
	check,
	date,
	integer,
	jsonb,
	numeric,
	pgEnum,
	pgSchema,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const NIS_ID = 7 as const; // NOTE: this is nis - it will be in DB cus there is a mig before this
const CASH_ID = 1 as const; // NOTE: this is cash - there is a custom mig for this
const MARKET_ID = 1 as const; // NOTE: defend here supabase/migrations/0013_init_category.sql

const AMOUNT_PRECISION = {
	precision: 12,
	scale: 2,
};

export const profile = pgTable("profile", {
	id: uuid("id").primaryKey(),

	first_name: text("first_name").notNull(),
	last_name: text("last_name").notNull(),
	email: text("email").notNull().unique(),

	credit_card: varchar("credit_card", { length: 8 }).array(),

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
	value: text("value").unique().notNull(),
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
	value: text("value").unique().notNull(),
	is_income: boolean("is_income").default(false).notNull(),
	is_expense: boolean("is_expense").default(true).notNull(),
});

export const currency = pgTable("currency", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	iso_code: text("iso_code").notNull().unique(),
	iso_numeric_code: integer("iso_numeric_code").notNull().unique(),
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

// Supabase manages Vault; migrations must not create or modify this table.
const vaultSecrets = pgSchema("vault").table("secrets", {
	id: uuid("id").primaryKey(),
});

export const autoSyncConf = pgTable(
	"auto_sync_conf",
	{
		id: serial("id").primaryKey(),
		srcName: text("src_name").notNull().unique(),
		srcLabel: text("src_label").notNull(),
		lookback_days: integer("lookback_days").notNull(),
		public_config: jsonb("public_config")
			.$type<Record<string, unknown>>()
			.notNull()
			.default({}),
		credentials_secret_id: uuid("credentials_secret_id").references(
			() => vaultSecrets.id,
		),
		isEnabled: boolean("is_enabled").notNull().default(false),
		transaction_type_id: integer("transaction_type_id").references(
			() => transactionType.id,
		),
	},
	(table) => [
		check("auto_sync_conf_positive_lookback", sql`${table.lookback_days} > 0`),
		check(
			"auto_sync_conf_public_config_object",
			sql`jsonb_typeof(${table.public_config}) = 'object'`,
		),
		check(
			"auto_sync_conf_enabled_transaction_type",
			sql`NOT ${table.isEnabled} OR ${table.transaction_type_id} IS NOT NULL`,
		),
	],
);

export const maxSyncTable = pgTable("max_sync_table", {
	id: serial("id").primaryKey(),
	ref_nbr: text("ref_nbr").notNull().unique(),
	actual_payment_amount: numeric("actual_payment_amount", AMOUNT_PRECISION),
	comments: text("comments"),
	merchant_name: text("merchant_name"),
	original_amount: numeric("original_amount", AMOUNT_PRECISION),
	original_currency: text("original_currency"),
	payment_currency: integer("payment_currency"),
	payment_date: timestamp("payment_date"),
	purchase_date: timestamp("purchase_date"),
	short_card_number: text("short_card_number"),
	plan_name: text("plan_name"),
	promotion_club: text("promotion_club"),
	promotion_amount: numeric("promotion_amount", AMOUNT_PRECISION),
	merchant_address: text("merchant_address"),
	merchant_commercial_name: text("merchant_commercial_name"),
	merchant: text("merchant"),
	merchant_number: text("merchant_number"),
	deal_user_name: text("deal_user_name"),
	deal_amount_ils: numeric("deal_amount_ils", AMOUNT_PRECISION),
	deal_processing_date: timestamp("deal_processing_date"),
	deal_purchase_time: text("deal_purchase_time"),
	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const transaction = pgTable("transaction", {
	id: serial("id").primaryKey(),

	max_sync_table_id: integer("max_sync_table_id").references(
		() => maxSyncTable.id,
	),

	profile_id: uuid("profile_id").references(() => profile.id),

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

	amount: numeric("amount", AMOUNT_PRECISION).notNull(),
	amount_nis: numeric("amount_nis", AMOUNT_PRECISION),

	description: text("description"),

	transaction_at: timestamp("transaction_at", {
		withTimezone: true,
	}).notNull(),

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

	credit_card_column: text("credit_card_column"),

	positive_amount_column: text("positive_amount_column"),
	negative_amount_column: text("negative_amount_column"),

	// this is basically asking "is a positive num"
	// true === -
	// false === +
	positive_amount_sign: boolean("positive_amount_sign").default(true),
	negative_amount_sign: boolean("negative_amount_sign").default(true),

	transaction_type_id: integer("transaction_type_id")
		.default(CASH_ID)
		.notNull()
		.references(() => transactionType.id),

	description_column_list: varchar("description_column_list", {
		length: 200,
	}).array(),

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
	"duplicates",
]);

export const importRow = pgTable(
	"import_row",
	{
		id: serial("id").primaryKey(),

		profile_id: uuid("profile_id").references(() => profile.id),

		import_batch_id: integer("import_batch_id").references(
			() => importBatch.id,
			{ onDelete: "cascade" },
		),

		date: date("date"),

		amount: numeric("amount", AMOUNT_PRECISION).notNull(),

		description: text("description"),

		tag_id: integer("tag_id").references(() => transactionTag.id),

		category_id: integer("category_id").references(
			() => transactionCategory.id,
		),

		project_id: integer("project_id").references(() => transactionProject.id),

		status: importRowStatusEnum("status").notNull().default("pending"),

		currency_id: integer("currency_id").references(() => currency.id),
		duplicate_transaction_id: integer("duplicate_transaction_id").references(
			() => transaction.id,
			{ onDelete: "set null" },
		),

		transaction_id: integer("transaction_id").references(() => transaction.id, {
			onDelete: "set null",
		}),

		amount_nis: numeric("amount_nis", AMOUNT_PRECISION),

		created_at: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),

		updated_at: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),

		max_sync_table_id: integer("max_sync_table_id")
			.unique()
			.references(() => maxSyncTable.id),
	},
	(table) => [
		check(
			"import_row_exactly_one_source",
			sql`(${table.import_batch_id} IS NOT NULL) <> (${table.max_sync_table_id} IS NOT NULL)`,
		),
		check(
			"import_row_auto_sync_merge_fields",
			sql`${table.max_sync_table_id} IS NULL OR (${table.currency_id} IS NOT NULL AND ${table.transaction_type_id} IS NOT NULL)`,
		),
	],
);

export const transactionClassificationRuleActionEnum = pgEnum(
	"transaction_classification_rule_action",
	["addData", "dropRow"],
);

export const transactionClassificationRule = pgTable(
	"transaction_classification_rule",
	{
		id: serial("id").primaryKey(),

		text_to_find: text("text_to_find").notNull().unique(),

		action: transactionClassificationRuleActionEnum("action")
			.notNull()
			.default("addData"),

		category_id: integer("category_id").references(
			() => transactionCategory.id,
		),

		tag_id: integer("tag_id").references(() => transactionTag.id),

		created_at: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
);

// ============================================================================
//	Types
// ============================================================================

export type ImportRowData = Omit<ImportRowInsert, "import_batch_id">;

export type ImportBatchStatusEnum =
	(typeof importBatchStatusEnum.enumValues)[number];
export type ImportRowStatusEnum =
	(typeof importRowStatusEnum.enumValues)[number];
export type TransactionClassificationRuleActionEnum =
	(typeof transactionClassificationRuleActionEnum.enumValues)[number];

export type ImportRow = InferSelectModel<typeof importRow>;

export type AutoSyncConf = InferSelectModel<typeof autoSyncConf>;
export type AutoSyncConfInsert = InferInsertModel<typeof autoSyncConf>;
export type MaxSyncTable = InferSelectModel<typeof maxSyncTable>;
export type MaxSyncTableInsert = InferInsertModel<typeof maxSyncTable>;

export type ImportRowInsert = typeof importRow.$inferInsert;
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
export type TransactionInsert = InferInsertModel<typeof transaction>;

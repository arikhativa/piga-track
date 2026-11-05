CREATE TABLE "auto_sync_conf" (
	"id" serial PRIMARY KEY NOT NULL,
	"src_name" text NOT NULL,
	"src_label" text NOT NULL,
	"lookback_days" integer NOT NULL,
	"public_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"credentials_secret_id" uuid,
	"is_enabled" boolean DEFAULT false NOT NULL,
	"transaction_type_id" integer,
	CONSTRAINT "auto_sync_conf_src_name_unique" UNIQUE("src_name"),
	CONSTRAINT "auto_sync_conf_positive_lookback" CHECK ("auto_sync_conf"."lookback_days" > 0),
	CONSTRAINT "auto_sync_conf_public_config_object" CHECK (jsonb_typeof("auto_sync_conf"."public_config") = 'object'),
	CONSTRAINT "auto_sync_conf_enabled_transaction_type" CHECK (NOT "auto_sync_conf"."is_enabled" OR "auto_sync_conf"."transaction_type_id" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "max_sync_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"ref_nbr" text NOT NULL,
	"actual_payment_amount" numeric(12, 2),
	"comments" text,
	"merchant_name" text,
	"original_amount" numeric(12, 2),
	"original_currency" text,
	"payment_currency" integer,
	"payment_date" timestamp,
	"purchase_date" timestamp,
	"short_card_number" text,
	"plan_name" text,
	"promotion_club" text,
	"promotion_amount" numeric(12, 2),
	"merchant_address" text,
	"merchant_commercial_name" text,
	"merchant" text,
	"merchant_number" text,
	"deal_user_name" text,
	"deal_amount_ils" numeric(12, 2),
	"deal_processing_date" timestamp,
	"deal_purchase_time" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "max_sync_table_ref_nbr_unique" UNIQUE("ref_nbr")
);
--> statement-breakpoint
ALTER TABLE "import_profile" ALTER COLUMN "description_column_list" SET DATA TYPE varchar(200)[];--> statement-breakpoint
ALTER TABLE "import_row" ALTER COLUMN "import_batch_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "currency" ADD COLUMN "iso_numeric_code" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "import_row" ADD COLUMN "currency_id" integer;--> statement-breakpoint
ALTER TABLE "import_row" ADD COLUMN "amount_nis" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "import_row" ADD COLUMN "max_sync_table_id" integer;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "max_sync_table_id" integer;--> statement-breakpoint
ALTER TABLE "auto_sync_conf" ADD CONSTRAINT "auto_sync_conf_credentials_secret_id_secrets_id_fk" FOREIGN KEY ("credentials_secret_id") REFERENCES "vault"."secrets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auto_sync_conf" ADD CONSTRAINT "auto_sync_conf_transaction_type_id_transaction_type_id_fk" FOREIGN KEY ("transaction_type_id") REFERENCES "public"."transaction_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_currency_id_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_max_sync_table_id_max_sync_table_id_fk" FOREIGN KEY ("max_sync_table_id") REFERENCES "public"."max_sync_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_max_sync_table_id_max_sync_table_id_fk" FOREIGN KEY ("max_sync_table_id") REFERENCES "public"."max_sync_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_row" DROP COLUMN "row_number";--> statement-breakpoint
ALTER TABLE "currency" ADD CONSTRAINT "currency_iso_numeric_code_unique" UNIQUE("iso_numeric_code");--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_max_sync_table_id_unique" UNIQUE("max_sync_table_id");--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_exactly_one_source" CHECK (("import_row"."import_batch_id" IS NOT NULL) <> ("import_row"."max_sync_table_id" IS NOT NULL));--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_auto_sync_merge_fields" CHECK ("import_row"."max_sync_table_id" IS NULL OR ("import_row"."currency_id" IS NOT NULL AND  IS NOT NULL));
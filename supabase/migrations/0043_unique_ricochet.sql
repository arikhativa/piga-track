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
INSERT INTO "auto_sync_conf" (
	"id", "src_name", "src_label", "lookback_days", "public_config",
	"credentials_secret_id", "is_enabled", "transaction_type_id"
) VALUES (
	1, 'Max', 'מקס', 3, '{"username":""}'::jsonb,
	NULL, false, NULL
);
--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('auto_sync_conf', 'id'), (SELECT MAX("id") FROM "auto_sync_conf"));
--> statement-breakpoint

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
--
-- custom logic to change the description_column_list type
CREATE OR REPLACE FUNCTION trim_description_array(arr text[])
RETURNS varchar(200)[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN arr IS NULL THEN NULL
    ELSE ARRAY(
      SELECT LEFT(value, 200)::varchar(200)
      FROM unnest(arr) WITH ORDINALITY AS t(value, ord)
      ORDER BY ord
    )
  END;
$$;

ALTER TABLE "import_profile"
ALTER COLUMN "description_column_list"
SET DATA TYPE varchar(200)[]
USING trim_description_array("description_column_list"::text[]);

DROP FUNCTION trim_description_array(text[]);
-- custom logic to change the description_column_list type END

ALTER TABLE "import_row" ALTER COLUMN "import_batch_id" DROP NOT NULL;--> statement-breakpoint

-- Custom code to add the iso_numeric_code
ALTER TABLE "currency" ADD COLUMN "iso_numeric_code" integer;--> statement-breakpoint

UPDATE "currency"
SET "iso_numeric_code" = CASE "iso_code"
	WHEN 'USD' THEN 840
	WHEN 'EUR' THEN 978
	WHEN 'GBP' THEN 826
	WHEN 'ILS' THEN 376
	WHEN 'CHF' THEN 756
	WHEN 'EGP' THEN 818
END
WHERE "iso_code" IN ('USD', 'EUR', 'GBP', 'ILS', 'CHF', 'EGP');
--> statement-breakpoint
DELETE FROM "currency"
WHERE "iso_code" NOT IN ('USD', 'EUR', 'GBP', 'ILS', 'CHF', 'EGP');
--> statement-breakpoint
ALTER TABLE "currency" ALTER COLUMN "iso_numeric_code" SET NOT NULL;--> statement-breakpoint
-- Custom code to add the iso_numeric_code END

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
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_auto_sync_merge_fields" CHECK ("import_row"."max_sync_table_id" IS NULL OR ("import_row"."currency_id" IS NOT NULL));

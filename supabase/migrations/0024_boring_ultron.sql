CREATE TABLE "import_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"currency_id" integer DEFAULT 7 NOT NULL,
	"start_row" integer,
	"date_column" text,
	"positive_amount_column" text,
	"negative_amount_column" text,
	"tag_column" text,
	"description_column" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "import_profile" ADD CONSTRAINT "import_profile_currency_id_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;
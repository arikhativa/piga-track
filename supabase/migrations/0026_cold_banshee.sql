CREATE TYPE "public"."import_batch_status" AS ENUM('draft', 'approved', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."import_row_status" AS ENUM('pending', 'merged', 'dropped');--> statement-breakpoint
CREATE TABLE "import_batch" (
	"id" serial PRIMARY KEY NOT NULL,
	"import_profile_id" integer NOT NULL,
	"batch_name" text NOT NULL,
	"status" "import_batch_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "import_row" (
	"id" serial PRIMARY KEY NOT NULL,
	"import_batch_id" integer NOT NULL,
	"row_number" integer NOT NULL,
	"date" date,
	"amount" numeric(12, 2) NOT NULL,
	"description" text,
	"tag_id" integer,
	"category_id" integer,
	"project_id" integer,
	"status" "import_row_status" DEFAULT 'pending' NOT NULL,
	"transaction_id" integer,
	"duplicate_transaction_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "import_batch" ADD CONSTRAINT "import_batch_import_profile_id_import_profile_id_fk" FOREIGN KEY ("import_profile_id") REFERENCES "public"."import_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_import_batch_id_import_batch_id_fk" FOREIGN KEY ("import_batch_id") REFERENCES "public"."import_batch"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_tag_id_transaction_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."transaction_tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_category_id_transaction_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."transaction_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_project_id_transaction_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."transaction_project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_duplicate_transaction_id_transaction_id_fk" FOREIGN KEY ("duplicate_transaction_id") REFERENCES "public"."transaction"("id") ON DELETE no action ON UPDATE no action;
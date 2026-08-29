CREATE TABLE "transaction_project" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "default_currency_id" SET DEFAULT 7;--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "currency_id" SET DEFAULT 7;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "default_category_id" integer;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "project_id" integer;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_default_category_id_transaction_category_id_fk" FOREIGN KEY ("default_category_id") REFERENCES "public"."transaction_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_project_id_transaction_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."transaction_project"("id") ON DELETE no action ON UPDATE no action;
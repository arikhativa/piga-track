ALTER TABLE "transaction" ADD COLUMN "sub_category_id" integer;--> statement-breakpoint
ALTER TABLE "transaction_category" ADD CONSTRAINT "transaction_category_id_parent_id_unique" UNIQUE("id","parent_id");--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_sub_category_id_transaction_category_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."transaction_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_sub_category_parent_fk" FOREIGN KEY ("sub_category_id","category_id") REFERENCES "public"."transaction_category"("id","parent_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_sub_category_requires_category" CHECK ("transaction"."sub_category_id" IS NULL OR "transaction"."category_id" IS NOT NULL);

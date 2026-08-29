ALTER TABLE "profile" ALTER COLUMN "default_currency_id" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "currency_id" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "default_transaction_type_id" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "transaction_type_id" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_default_transaction_type_id_transaction_type_id_fk" FOREIGN KEY ("default_transaction_type_id") REFERENCES "public"."transaction_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_transaction_type_id_transaction_type_id_fk" FOREIGN KEY ("transaction_type_id") REFERENCES "public"."transaction_type"("id") ON DELETE no action ON UPDATE no action;
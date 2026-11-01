ALTER TABLE "transaction" ALTER COLUMN "profile_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "import_profile" ADD COLUMN "credit_card_column" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "credit_card" varchar(8);--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_credit_card_unique" UNIQUE("credit_card");
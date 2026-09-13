ALTER TABLE "import_profile" RENAME COLUMN "description_column" TO "description_column_list";--> statement-breakpoint
ALTER TABLE "import_profile" ADD COLUMN "positive_amount_sign" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "import_profile" ADD COLUMN "negative_amount_sign" boolean DEFAULT true;
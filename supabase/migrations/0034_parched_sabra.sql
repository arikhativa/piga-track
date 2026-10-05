ALTER TABLE "import_row" DROP CONSTRAINT "import_row_transaction_id_transaction_id_fk";
--> statement-breakpoint
ALTER TABLE "import_row" DROP CONSTRAINT "import_row_duplicate_transaction_id_transaction_id_fk";
--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_duplicate_transaction_id_transaction_id_fk" FOREIGN KEY ("duplicate_transaction_id") REFERENCES "public"."transaction"("id") ON DELETE set null ON UPDATE no action;
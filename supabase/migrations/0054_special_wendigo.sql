DROP INDEX "transaction_category_parent_id_idx";--> statement-breakpoint
CREATE INDEX "import_row_batch_status_idx" ON "import_row" USING btree ("import_batch_id","status");--> statement-breakpoint
CREATE INDEX "import_row_duplicate_transaction_id_idx" ON "import_row" USING btree ("duplicate_transaction_id");--> statement-breakpoint
CREATE INDEX "import_row_transaction_id_idx" ON "import_row" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "transaction_transaction_at_idx" ON "transaction" USING btree ("transaction_at");
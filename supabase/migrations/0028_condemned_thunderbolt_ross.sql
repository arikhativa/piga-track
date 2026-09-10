ALTER TABLE "import_row" DROP CONSTRAINT "import_row_import_batch_id_import_batch_id_fk";
--> statement-breakpoint
ALTER TABLE "import_row" ADD CONSTRAINT "import_row_import_batch_id_import_batch_id_fk" FOREIGN KEY ("import_batch_id") REFERENCES "public"."import_batch"("id") ON DELETE cascade ON UPDATE no action;
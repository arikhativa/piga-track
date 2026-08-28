CREATE TABLE "transaction_tag" (
	"id" serial PRIMARY KEY,
	"value" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "tag_id" integer;--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_tag_id_key" UNIQUE("tag_id");--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_tag_id_transaction_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "transaction_tag"("id");

-- RLS

ALTER TABLE "transaction_tag" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select transaction tags"
ON "transaction_tag"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert transaction tags"
ON "transaction_tag"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update transaction tags"
ON "transaction_tag"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transaction tags"
ON "transaction_tag"
FOR DELETE
TO authenticated
USING (true);
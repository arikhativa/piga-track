CREATE TABLE "transaction" (
	"id" serial PRIMARY KEY,
	"profile_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_profile_id_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id");

-- RLS
ALTER TABLE "transaction" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select transactions"
ON "transaction"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert transactions"
ON "transaction"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update transactions"
ON "transaction"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transactions"
ON "transaction"
FOR DELETE
TO authenticated
USING (true);
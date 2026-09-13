ALTER TABLE "transaction" ADD COLUMN "transaction_at" timestamp with time zone;

UPDATE "transaction"
SET "transaction_at" = "created_at";

ALTER TABLE "transaction"
ALTER COLUMN "transaction_at" SET NOT NULL;
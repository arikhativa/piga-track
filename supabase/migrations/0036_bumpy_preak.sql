CREATE TYPE "public"."transaction_classification_rule_action" AS ENUM('addData', 'dropRow');--> statement-breakpoint
ALTER TABLE "transaction_classification_rule" DROP CONSTRAINT "classification_rule_has_assignment";--> statement-breakpoint
ALTER TABLE "transaction_classification_rule" ADD COLUMN "action" "transaction_classification_rule_action" DEFAULT 'addData' NOT NULL;
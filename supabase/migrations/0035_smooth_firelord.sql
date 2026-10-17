CREATE TABLE "transaction_classification_rule" (
	"id" serial PRIMARY KEY NOT NULL,
	"text_to_find" text NOT NULL,
	"category_id" integer,
	"tag_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transaction_classification_rule_text_to_find_unique" UNIQUE("text_to_find"),
	CONSTRAINT "classification_rule_has_assignment" CHECK ("transaction_classification_rule"."category_id" IS NOT NULL OR "transaction_classification_rule"."tag_id" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "transaction_classification_rule" ADD CONSTRAINT "transaction_classification_rule_category_id_transaction_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."transaction_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_classification_rule" ADD CONSTRAINT "transaction_classification_rule_tag_id_transaction_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."transaction_tag"("id") ON DELETE no action ON UPDATE no action;
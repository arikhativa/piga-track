CREATE TABLE "exchange_rate" (
	"iso_code" text NOT NULL,
	"date" date NOT NULL,
	"rate" numeric(12, 6) NOT NULL,
	CONSTRAINT "exchange_rate_date_iso_code_pk" PRIMARY KEY("date","iso_code")
);
--> statement-breakpoint
ALTER TABLE "exchange_rate" ADD CONSTRAINT "exchange_rate_iso_code_currency_iso_code_fk" FOREIGN KEY ("iso_code") REFERENCES "public"."currency"("iso_code") ON DELETE no action ON UPDATE no action;
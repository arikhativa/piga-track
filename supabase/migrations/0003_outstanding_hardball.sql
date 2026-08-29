CREATE TABLE "currency" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"iso_code" text NOT NULL,
	"symbol" text NOT NULL,
	CONSTRAINT "currency_iso_code_unique" UNIQUE("iso_code")
);

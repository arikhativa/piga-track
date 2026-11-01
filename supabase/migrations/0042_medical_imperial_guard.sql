ALTER TABLE "profile" DROP CONSTRAINT "profile_credit_card_unique";--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "credit_card" SET DATA TYPE varchar(8)[] USING NULL::varchar(8)[];

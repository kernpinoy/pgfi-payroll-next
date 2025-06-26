CREATE TYPE "public"."cutooff" AS ENUM('a', 'b');--> statement-breakpoint
ALTER TABLE "attendance" ALTER COLUMN "time_in" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attendance" ALTER COLUMN "time_in" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance" ALTER COLUMN "time_out" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attendance" ALTER COLUMN "time_out" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "cutoff" "cutooff" NOT NULL;
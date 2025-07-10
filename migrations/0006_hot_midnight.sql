CREATE TYPE "public"."deduction_type" AS ENUM('fixed', 'percentage');--> statement-breakpoint
ALTER TYPE "public"."cutooff" RENAME TO "cutoff";--> statement-breakpoint
CREATE TABLE "employee_deduction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deduction_name" text NOT NULL,
	"deduction_type" "deduction_type" NOT NULL,
	"amount" double precision NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "break_time_hours" double precision DEFAULT 1.0;
CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"date" date NOT NULL,
	"time_in" timestamp with time zone,
	"time_out" timestamp with time zone,
	"regular" boolean DEFAULT false NOT NULL,
	"special_non_working" boolean DEFAULT false,
	"undertime" boolean DEFAULT false,
	"overtime" boolean DEFAULT false,
	"overtime_hours" double precision DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "employees" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "employees" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "employees" ALTER COLUMN "date_of_birth" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;
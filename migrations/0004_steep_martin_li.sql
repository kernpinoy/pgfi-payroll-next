ALTER TABLE "employees" ALTER COLUMN "work_rate" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_employee_id_unique" UNIQUE("employee_id");
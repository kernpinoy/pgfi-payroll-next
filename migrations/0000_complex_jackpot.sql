CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"middle_initial" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" text NOT NULL,
	"contact_no" text NOT NULL,
	"email" text NOT NULL,
	"employee_id" text NOT NULL,
	"address" text NOT NULL,
	"work_rate" integer,
	"bank_name" text,
	"bank_number" text,
	"sss" text,
	"phic" text,
	"hdmf_mid" text,
	"tin" text,
	"profile_picture" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"hashed_password" text NOT NULL,
	"salt" text NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_salt_unique" UNIQUE("salt")
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
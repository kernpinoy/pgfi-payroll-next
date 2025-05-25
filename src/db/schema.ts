import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, serial, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  salt: text("salt").notNull().unique(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  lastName: text("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth", { mode: "date" }).notNull(),
  contactNo: text("contact_no").notNull(),
  email: text("email").notNull(),
  employeeId: text("employee_id").notNull(),
  address: text("address").notNull(),
  workRate: integer("work_rate"),
  bankName: text("bank_name"),
  bankNumber: text("bank_number"),
  sss: text("sss"),
  phic: text("phic"),
  hdmfMid: text("hdmf_mid"),
  tin: text("tin"),
});

export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
export type Employees = InferSelectModel<typeof employees>;

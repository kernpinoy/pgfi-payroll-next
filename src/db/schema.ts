import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  date,
  boolean,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";

export const cutoff = pgEnum("cutoff", ["a", "b"]);
export const deductionType = pgEnum("deduction_type", ["fixed", "percentage"]);

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
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth", { mode: "date" }).notNull(),
  contactNo: text("contact_no").notNull(),
  email: text("email").notNull(),
  employeeId: text("employee_id").notNull().unique(),
  address: text("address").notNull(),
  workRate: doublePrecision("work_rate").default(0.0),
  bankName: text("bank_name"),
  bankNumber: text("bank_number"),
  sss: text("sss"),
  phic: text("phic"),
  hdmfMid: text("hdmf_mid"),
  tin: text("tin"),
});

export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  cutoff: cutoff("cutoff").notNull(),
  timeIn: text("time_in").notNull(),
  timeOut: text("time_out").notNull(),
  regularHoliday: boolean("regular").notNull().default(false),
  specialNonWorkingHoliday: boolean("special_non_working").default(false),
  undertime: boolean("undertime").default(false),
  overtime: boolean("overtime").default(false),
  overtimeHours: doublePrecision("overtime_hours").default(0.0),
  breakTimeHours: doublePrecision("break_time_hours").default(1.0),
});

export const employeeDeduction = pgTable("employee_deduction", {
  id: uuid("id").primaryKey().defaultRandom(),
  deductionName: text("deduction_name").notNull(),
  deductionType: deductionType("deduction_type").notNull(),
  amount: doublePrecision("amount").notNull(), // deduction amount or rate
  active: boolean("active").default(true).notNull(),
});

export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
export type Employees = InferSelectModel<typeof employees>;
export type Attendance = InferSelectModel<typeof attendance>;

// single field per deduction (like sss, philhealth, hdmf, etc.)
// from gross salary - (sss, philhealth, hdmf)
// for sss = gross salary - (total sweldo ng employee * 5%)
// for philhealth = gross salary - (total sweldo ng employee * 5%)
// for hdmf = gross salary - (total sweldo ng employee * 5%)
// for tax = gross salary - (total sweldo ng employee * 5%)
// = net salary
//
// net = gross - ((gross - (sss, philhealth, hdmf)) * 5%)
// net = gross 0 ((gross  - (sss, philhealth, hdmf) * 5% * 5%))
// net = gross - ((gross * 5%) + (gross * 5%) + (gross * 5%))

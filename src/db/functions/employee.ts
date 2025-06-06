"use server";

import { db } from "..";
import { attendance, employees, type Employees } from "../schema";
import { employeeFullName } from "../raw-commands";
import { getTableColumns } from "drizzle-orm";

export async function getEmployees(): Promise<
  (Employees & { fullName: string })[]
> {
  const data = await db
    .select({
      ...getTableColumns(employees),
      fullName: employeeFullName,
    })
    .from(employees);

  return data;
}

export async function getEmployeeAttendance() {
  const data = await db.select().from(attendance);

  return data;
}

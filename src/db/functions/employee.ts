"use server";

import { db } from "..";
import { attendance, employees, type Employees } from "../schema";
import { employeeFullName } from "../raw-commands";
import { getTableColumns, eq, count } from "drizzle-orm";
import {
  calculateCutoffDetails,
  calculateDeductions,
  filterAttendance,
  splitAttendanceByCutoff,
} from "@/lib/time-stuffs";

// Constants for payroll calculations
const PAGIBIG_CUTOFF_AMOUNT = 200;

/**
 * Gets the total count of employees
 */
export async function getEmployeeCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(employees);
  return result.count;
}

/**
 * Retrieves all employees with their full names
 */
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

/**
 * Retrieves all attendance records
 */
export async function getEmployeeAttendance() {
  const data = await db.select().from(attendance);
  return data;
}

/**
 * Retrieves a single attendance record by ID
 */
export async function getAttendanceById(attendanceId: string) {
  const [data] = await db
    .select()
    .from(attendance)
    .where(eq(attendance.id, attendanceId));
  return data;
}

/**
 * Main function to calculate deductions per employee
 * Splits calculations by cutoff periods:
 * - Cutoff A: Pag-IBIG deductions only
 * - Cutoff B: SSS and PhilHealth deductions only
 */
export async function getDeductionsPerEmployee(
  employeeId: string,
  month?: string,
  year?: string
) {
  // fetch fist the employee details
  const employee = await db.query.employees.findFirst({
    where: (employees, { eq }) => eq(employees.id, employeeId),
    extras: {
      fullName: employeeFullName.as("fullName"),
    },
  });

  // get the attendance records for the employee
  const employeeAttendanceRecords = await db
    .select()
    .from(attendance)
    .where(eq(attendance.employeeId, employeeId));

  // filter attendance records by month and year
  const filteredAttendance = filterAttendance(
    month!,
    year!,
    employeeAttendanceRecords
  );

  // split attendance records by cutoff
  const { cutoffA, cutoffB } = splitAttendanceByCutoff(filteredAttendance);

  // calculate pay details for each cutoff
  const payDetailsA = calculateCutoffDetails(cutoffA, employee?.workRate as number);
  const payDetailsB = calculateCutoffDetails(cutoffB, employee?.workRate as number);

  // final
  const netPayA = payDetailsA.grossPay - PAGIBIG_CUTOFF_AMOUNT;
  const deductionB = calculateDeductions(
    payDetailsB.grossPay,
    employee?.workRate as number
  );
  const netPayB = payDetailsB.grossPay - deductionB.totalDeduction;

  return {
    employee,
    employeeAttendanceRecords,
    cutoffA: {
      period: "A",
      ...payDetailsA,
      netPay: netPayA,
      deductionsList: [
        {
          name: "Pag-IBIG",
          amount: PAGIBIG_CUTOFF_AMOUNT,
        },
      ],
      totalDeduction: PAGIBIG_CUTOFF_AMOUNT,
    },
    cutoffB: {
      period: "B",
      ...payDetailsB,
      netPay: netPayB,
      deductionsList: deductionB.breakDown,
      totalDeduction: deductionB.totalDeduction,
    },
  };
}

export type GetDeductionsPerEmployee = Awaited<ReturnType<typeof getDeductionsPerEmployee>>;
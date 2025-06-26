"use server";

import { db } from "..";
import { attendance, employees, type Employees } from "../schema";
import { employeeFullName } from "../raw-commands";
import { getTableColumns, eq, count } from "drizzle-orm";
import { computeHoursWorked } from "@/lib/time-stuffs";
import { getPhilHealthContribution } from "@/lib/philhealth-contrib";
import { getEEFromGross } from "@/lib/sss-contrib";
import { getPagibigOffset } from "@/lib/pagibig-contrib";
import { computeGrossPayTotal, computeOvertimePay } from "@/lib/money";

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
export async function getDeductionsPerEmployee(employeeId: string) {
  // Fetch required data
  const [employee] = await db
    .select({
      ...getTableColumns(employees),
      fullName: employeeFullName,
    })
    .from(employees)
    .where(eq(employees.id, employeeId));
  const employeeAttendance = await db
    .select()
    .from(attendance)
    .where(eq(attendance.employeeId, employeeId));

  // Calculate basic employee rates
  const workRate = employee.workRate!;
  const ratePerHour = workRate / 8; // STANDARD_WORK_HOURS = 8

  // split attendance into two cutoffs
  const cutoffA = employeeAttendance.filter((record) => record.cutoff === "a");
  const cutoffB = employeeAttendance.filter((record) => record.cutoff === "b");

  // count regular holiday and special non-working holiday
  const regularHolidayCountA = cutoffA.filter(
    (record) => record.regularHoliday
  ).length;
  const specialHolidayCountA = cutoffA.filter(
    (record) => record.specialNonWorkingHoliday
  ).length;
  const regularHolidayCountB = cutoffB.filter(
    (record) => record.regularHoliday
  ).length;
  const specialHolidayCountB = cutoffB.filter(
    (record) => record.specialNonWorkingHoliday
  ).length;

  // count overtime hours
  const totalOvertimeHoursA = cutoffA.reduce((total, record) => {
    return total + (record.overtimeHours || 0);
  }, 0);

  const totalOvertimeHoursB = cutoffB.reduce((total, record) => {
    return total + (record.overtimeHours || 0);
  }, 0);

  const regularHoursA = cutoffA
    .filter(
      (record) =>
        !record.overtime &&
        !record.regularHoliday &&
        !record.specialNonWorkingHoliday
    )
    .reduce(
      (total, record) =>
        total + computeHoursWorked(record.timeIn, record.timeOut),
      0
    );

  const regularHoursB = cutoffB
    .filter(
      (record) =>
        !record.overtime &&
        !record.regularHoliday &&
        !record.specialNonWorkingHoliday
    )
    .reduce(
      (total, record) =>
        total + computeHoursWorked(record.timeIn, record.timeOut),
      0
    );

  const regularPayA = ratePerHour * regularHoursA;
  const regularPayB = ratePerHour * regularHoursB;

  // Calculate regular holiday hours and pay
  const regularHolidayHoursA = cutoffA
    .filter((record) => record.regularHoliday && !record.overtime)
    .reduce(
      (total, record) =>
        total + computeHoursWorked(record.timeIn, record.timeOut),
      0
    );

  const regularHolidayHoursB = cutoffB
    .filter((record) => record.regularHoliday && !record.overtime)
    .reduce(
      (total, record) =>
        total + computeHoursWorked(record.timeIn, record.timeOut),
      0
    );

  // Calculate special non-working holiday hours and pay
  const specialHolidayHoursA = cutoffA
    .filter((record) => record.specialNonWorkingHoliday && !record.overtime)
    .reduce(
      (total, record) =>
        total + computeHoursWorked(record.timeIn, record.timeOut),
      0
    );

  const specialHolidayHoursB = cutoffB
    .filter((record) => record.specialNonWorkingHoliday && !record.overtime)
    .reduce(
      (total, record) =>
        total + computeHoursWorked(record.timeIn, record.timeOut),
      0
    );

  // Calculate holiday pay using rate multipliers

  const regularHolidayPayA = regularHolidayHoursA * ratePerHour * 2.0; // 2x multiplier
  const regularHolidayPayB = regularHolidayHoursB * ratePerHour * 2.0;

  const specialHolidayPayA = specialHolidayHoursA * ratePerHour * 1.3; // 1.3x multiplier
  const specialHolidayPayB = specialHolidayHoursB * ratePerHour * 1.3;

  // Only count overtime if accumulated total is at least 1 hour per cutoff
  // and apply holiday multipliers
  const overtimePayA = computeOvertimePay(cutoffA, workRate);
  console.log("Overtime Pay A:", overtimePayA);
  const overtimePayB = computeOvertimePay(cutoffB, workRate);
  console.log("Overtime Pay B:", overtimePayB);

  // Calculate hours worked for each cutoff
  const hoursWorkedA = cutoffA.reduce(
    (total, record) =>
      total + computeHoursWorked(record.timeIn, record.timeOut),
    0
  );

  const hoursWorkedB = cutoffB.reduce(
    (total, record) =>
      total + computeHoursWorked(record.timeIn, record.timeOut),
    0
  );

  const grossPayA = computeGrossPayTotal(cutoffA, workRate) + overtimePayA;
  const grossPayB = computeGrossPayTotal(cutoffB, workRate) + overtimePayB;
  const totalGrossPay = grossPayA + grossPayB;
  console.log("totalGrossPay:", totalGrossPay);

  // this is for cutoff b
  const phicDeductAmount = getPhilHealthContribution(workRate);
  const sssDeductAmount = getEEFromGross(totalGrossPay);
  const pagIbigOffest = getPagibigOffset(totalGrossPay);
  console.log("PHIC Deduct Amount:", phicDeductAmount);
  console.log("SSS Deduct Amount:", sssDeductAmount);
  console.log("Pag-IBIG Offset:", pagIbigOffest);

  let totalDeductionB = phicDeductAmount + sssDeductAmount!;
  console.log("Total Deduction B:", totalDeductionB);

  if (totalGrossPay <= 10_000) {
    totalDeductionB = totalDeductionB - pagIbigOffest;
  }

  console.log("Adjusted Total Deduction B:", totalDeductionB);

  const netPayA = grossPayA - PAGIBIG_CUTOFF_AMOUNT;
  const netPayB = grossPayB - totalDeductionB;

  return {
    employee,
    attendanceRecords: employeeAttendance,
    cutoffA: {
      period: "A",
      regularPay: regularPayA,
      regularHours: regularHoursA,
      hoursWorked: hoursWorkedA,
      overtime: totalOvertimeHoursA,
      regularHolidayPay: regularHolidayPayA,
      specialHolidayPay: specialHolidayPayA,
      regularHolidays: regularHolidayCountA,
      specialHolidays: specialHolidayCountA,
      grossPay: grossPayA,
      totalDeduction: PAGIBIG_CUTOFF_AMOUNT,
      netPay: netPayA,
      overtimePay: overtimePayA,
      deductionsList: [
        {
          name: "Pag-IBIG",
          amount: PAGIBIG_CUTOFF_AMOUNT,
        },
      ],
    },
    cutoffB: {
      period: "B",
      regularPay: regularPayB,
      regularHours: regularHoursB,
      hoursWorked: hoursWorkedB,
      overtime: totalOvertimeHoursB,
      regularHolidayPay: regularHolidayPayB,
      specialHolidayPay: specialHolidayPayB,
      regularHolidays: regularHolidayCountB,
      specialHolidays: specialHolidayCountB,
      grossPay: grossPayB,
      totalDeduction: totalDeductionB,
      netPay: netPayB,
      overtimePay: overtimePayB,
      deductionsList: [
        {
          name: "SSS",
          amount: sssDeductAmount,
        },
        {
          name: "PhilHealth",
          amount: phicDeductAmount,
        },
        {
          name: "Pag-IBIG offset",
          amount: totalGrossPay <= 10_000 ? -pagIbigOffest : 0,
        },
      ],
    },
  };
}

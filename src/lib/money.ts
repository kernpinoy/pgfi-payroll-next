import { Attendance } from "@/db/schema";
import { computeHoursWorked } from "./time-stuffs";

const STANDARD_WORK_HOURS = 8;

export function getHolidayMultiplier(attendance: Attendance) {
  if (attendance.regularHoliday) {
    return 2.0;
  }

  if (attendance.specialNonWorkingHoliday) {
    return 1.3;
  }

  return 1.0;
}

export function computeGrossPay(attendance: Attendance, workRate: number) {
  // take first the rate per hour
  const ratePerHour = workRate / STANDARD_WORK_HOURS;
  const hoursWorked = computeHoursWorked(attendance.timeIn, attendance.timeOut, attendance.breakTimeHours!);

  // get the holiday multiplier
  const holidayMultiplier = getHolidayMultiplier(attendance);
  const adjustedRate = ratePerHour * holidayMultiplier;

  // multiply the rate per hour by the hours worked
  const grossPay = adjustedRate * hoursWorked;

  return grossPay;
}

export function computeGrossPayTotal(
  attendances: Attendance[],
  workRate: number
) {
  return attendances.reduce((acc, attendance) => {
    return acc + computeGrossPay(attendance, workRate);
  }, 0);
}

export function computeOvertimePay(attendance: Attendance[], workRate: number) {
  const totalOvertimeHours = attendance.reduce((total, record) => {
    return total + (record.overtimeHours || 0);
  }, 0);

  if (totalOvertimeHours < 1) {
    return 0; // No overtime pay if less than 1 hour
  }

  // Calculate the rate per hour
  const ratePerHour = workRate / STANDARD_WORK_HOURS;

  // Calculate overtime pay with multiplier
  const overtimePay = attendance.reduce((total, record) => {
    const overtimeHours = record.overtimeHours || 0;
    const holidayMultiplier = getHolidayMultiplier(record);
    const overtimeRate = ratePerHour * holidayMultiplier;

    return total + overtimeHours * overtimeRate;
  }, 0);

  return overtimePay;
}

// regular holiday pay is 2x the rate per hour
// special non working holiday pay is 1.3x the rate per hour
// a - pagibig
// b - sss, philhealth

// overtime rules
// one hour minimum is needed to be overtime

// if regular holiday, double pay
// if special non working holiday, 1.3x pay
// else, 1x

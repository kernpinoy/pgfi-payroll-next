import { type Attendance } from "@/db/schema";
import { parse, differenceInMinutes, parseISO, isValid, getMonth, getYear } from "date-fns";
import { record } from "zod";
import { computeGrossPay, computeGrossPayTotal, computeOvertimePay } from "./money";
import { getPhilHealthContribution } from "./philhealth-contrib";
import { getEEFromGross } from "./sss-contrib";
import { getPagibigOffset } from "./pagibig-contrib";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STANDARD_WORK_HOURS = 8;

export function computeHoursWorked(
  timeIn: string,
  timeOut: string,
  lunchbreakHours: number
) {
  const baseDate = new Date();
  const parsedTimeIn = parse(timeIn, "HH:mm", baseDate);
  const parsedTimeOut = parse(timeOut, "HH:mm", baseDate);
  const totalMinutes = differenceInMinutes(parsedTimeOut, parsedTimeIn);

  const lunchbreak = lunchbreakHours * 60; // convert hours to minutes

  const netMinutes = totalMinutes - lunchbreak;

  return netMinutes / 60;
}

export function filterAttendance(
  month: string,
  year: string,
  attendanceRecords: Attendance[]
): Attendance[] {
  const monthInt = MONTHS.findIndex((m) => m.toLowerCase() === month.toLowerCase());
  const yearInt = parseInt(year, 10);

  return attendanceRecords.filter((record) => {
    const parsedDate = parseISO(record.date);

    const recordMonth = getMonth(parsedDate); // 0-based month
    const recordYear = getYear(parsedDate);

    const matchesMonth = !month || recordMonth === monthInt;
    const matchesYear = !year || recordYear === yearInt;

    return matchesMonth && matchesYear;
  });
}

export function splitAttendanceByCutoff(attendanceRecords: Attendance[]) {
  const cutoffA = attendanceRecords.filter((record) => record.cutoff === "a");
  const cutoffB = attendanceRecords.filter((record) => record.cutoff === "b");

  return {
    cutoffA,
    cutoffB,
  };
}

export function calculateCutoffDetails(attendanceRecords: Attendance[], workRate: number) {
  const ratePerHour = workRate / STANDARD_WORK_HOURS;

  const regularHours = attendanceRecords
    .filter(record => !record.overtime && !record.regularHoliday && !record.specialNonWorkingHoliday)
    .reduce((acc, r) => acc + computeHoursWorked(r.timeIn, r.timeOut, r.breakTimeHours!), 0);

  const overtimeHours = attendanceRecords.reduce((total, record) => total + (record.overtimeHours ?? 0), 0);

  const regularHolidayHours = attendanceRecords
    .filter(record => record.regularHoliday && !record.overtime)
    .reduce((total, record) => total + computeHoursWorked(record.timeIn, record.timeOut, record.breakTimeHours!), 0);

  const specialHolidayHours = attendanceRecords
    .filter(record => record.specialNonWorkingHoliday && !record.overtime)
    .reduce((total, record) => total + computeHoursWorked(record.timeIn, record.timeOut, record.breakTimeHours!), 0);

  // Count regular holiday and special holiday days
  const regularHolidayDays = attendanceRecords.filter(record => record.regularHoliday).length;
  const specialHolidayDays = attendanceRecords.filter(record => record.specialNonWorkingHoliday).length;

  const regularPay = regularHours * ratePerHour;
  const regularHolidayPay = regularHolidayHours * ratePerHour * 2.0;
  const specialHolidayPay = specialHolidayHours * ratePerHour * 1.3;
  const overtimePay = computeOvertimePay(attendanceRecords, workRate);

  const hoursWorked = attendanceRecords.reduce((total, record) => total + computeHoursWorked(record.timeIn, record.timeOut, record.breakTimeHours!), 0);

  const grossPay = computeGrossPayTotal(attendanceRecords, workRate) + overtimePay;

  // log all calculations in a table format
  return {
    regularHours,
    overtimeHours,
    regularHolidayHours,
    specialHolidayHours,
    regularHolidayDays,
    specialHolidayDays,
    regularPay,
    regularHolidayPay,
    specialHolidayPay,
    overtimePay,
    grossPay,
    hoursWorked,
  };
}

export function calculateDeductions(grossPay: number, workRate: number) {
  const phic = getPhilHealthContribution(workRate);
  const sss = getEEFromGross(grossPay);
  const pagibigOffset = getPagibigOffset(grossPay);

  let totalDeduction = phic + sss!;

  if (grossPay <= 10_000) {
    totalDeduction -= pagibigOffset;
  }

  return {
    totalDeduction,
    breakDown: [
      { name: "SSS", amount: sss}, 
      { name: "PhilHealth", amount: phic }, 
      { name: "Pag-IBIG offset ", amount: grossPay <= 10_000 ? -pagibigOffset : 0 }
    ],
  }
}
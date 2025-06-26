import { useQuery } from "@tanstack/react-query";
import { getDeductionsPerEmployee } from "@/db/functions/employee";

interface DeductionFilters {
  employeeId: string;
  month?: string;
  year?: string;
  cutoff?: "a" | "b";
}

export default function useGetEmployeeDeduction({
  employeeId,
  month,
  year,
  cutoff,
}: DeductionFilters) {
  return useQuery({
    queryKey: ["employee-deduction", employeeId, month, year, cutoff],
    queryFn: async () => getDeductionsPerEmployee(employeeId),
    enabled: !!employeeId,
    select: (data) => {
      if (!data) return data;

      // If no filters are applied, return all data
      if (!month && !year && !cutoff) return data;

      // Filter attendance records based on month, year, and cutoff
      let filteredAttendance = data.attendanceRecords;

      if (month || year) {
        filteredAttendance = filteredAttendance.filter((record) => {
          const recordDate = new Date(record.date);
          const recordMonth = recordDate.toLocaleString("en-US", {
            month: "long",
          });
          const recordYear = recordDate.getFullYear().toString();

          const matchesMonth = !month || recordMonth === month;
          const matchesYear = !year || recordYear === year;

          return matchesMonth && matchesYear;
        });
      }

      if (cutoff) {
        filteredAttendance = filteredAttendance.filter(
          (record) => record.cutoff === cutoff
        );
      }

      // If no records match the filter, return empty cutoffs
      if (filteredAttendance.length === 0) {
        return {
          ...data,
          cutoffA: {
            ...data.cutoffA,
            hoursWorked: 0,
            overtime: 0,
            regularHolidays: 0,
            specialHolidays: 0,
            grossPay: 0,
            totalDeduction: 0,
            netPay: 0,
            deductionsList: [],
            overtimePay: 0,
            regularHours: 0,
            regularHolidayPay: 0,
            specialHolidayPay: 0,
            regularPay: 0,
          },
          cutoffB: {
            ...data.cutoffB,
            hoursWorked: 0,
            overtime: 0,
            regularHolidays: 0,
            specialHolidays: 0,
            grossPay: 0,
            totalDeduction: 0,
            netPay: 0,
            regularHours: 0,
            regularHolidayPay: 0,
            specialHolidayPay: 0,
            regularPay: 0,
          },
        };
      }

      // If cutoff filter is specified, return only that cutoff with filtered data
      if (cutoff === "a") {
        return {
          ...data,
          cutoffB: {
            ...data.cutoffB,
            hoursWorked: 0,
            overtime: 0,
            regularHolidays: 0,
            specialHolidays: 0,
            grossPay: 0,
            totalDeduction: 0,
            netPay: 0,
            deductionsList: [],
            overtimePay: 0,
            regularHours: 0,
            regularHolidayPay: 0,
            specialHolidayPay: 0,
            regularPay: 0,
          },
        };
      } else if (cutoff === "b") {
        return {
          ...data,
          cutoffA: {
            ...data.cutoffA,
            hoursWorked: 0,
            overtime: 0,
            regularHolidays: 0,
            specialHolidays: 0,
            grossPay: 0,
            totalDeduction: 0,
            netPay: 0,
            deductionsList: [],
            overtimePay: 0,
            regularHours: 0,
            regularHolidayPay: 0,
            specialHolidayPay: 0,
            regularPay: 0,
          },
        };
      }

      // For month/year filtering without cutoff filter, we need to recalculate the payroll
      // This is a simplified approach - ideally we'd recreate the calculation logic here
      return data;
    },
  });
}

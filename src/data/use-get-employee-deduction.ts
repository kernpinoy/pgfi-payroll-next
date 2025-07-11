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
    queryFn: async () => getDeductionsPerEmployee(employeeId, month, year),
    enabled: !!employeeId,
    select: (data) => {
      if (!data) return data;

      // If no cutoff filter, return all data since month/year already filtered in getDeductionsPerEmployee
      if (!cutoff) return data;

      // Filter by cutoff
      if (cutoff === "a") {
        return {
          ...data,
          cutoffB: {
            period: "B",
            regularPay: 0,
            regularHours: 0,
            hoursWorked: 0,
            overtime: 0,
            regularHolidayPay: 0,
            specialHolidayPay: 0,
            regularHolidays: 0,
            specialHolidays: 0,
            grossPay: 0,
            totalDeduction: 0,
            netPay: 0,
            overtimePay: 0,
            deductionsList: [],
          },
        };
      } else {
        return {
          ...data,
          cutoffA: {
            period: "A",
            regularPay: 0,
            regularHours: 0,
            hoursWorked: 0,
            overtime: 0,
            regularHolidayPay: 0,
            specialHolidayPay: 0,
            regularHolidays: 0,
            specialHolidays: 0,
            grossPay: 0,
            totalDeduction: 0,
            netPay: 0,
            overtimePay: 0,
            deductionsList: [],
          },
        };
      }
    },
  });
}

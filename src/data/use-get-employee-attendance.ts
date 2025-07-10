import { getEmployeeAttendance } from "@/db/functions/employee";
import { useQuery } from "@tanstack/react-query";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface AttendanceFilters {
  employeeId?: string;
  month?: string;
  year?: string;
  cutoff?: string;
}

export default function useGetEmployeeAttendance(
  filters: AttendanceFilters = {}
) {
  const {
    employeeId = "all",
    month = "all",
    year = "all",
    cutoff = "all",
  } = filters;

  return useQuery({
    queryKey: ["employees-attendance", filters],
    queryFn: async () => getEmployeeAttendance(),
    select: (data) => {
      if (!data) return data;

      const filteredData = data.filter((record) => {
        // Filter by employee
        if (employeeId !== "all" && record.employeeId !== employeeId) {
          return false;
        }

        // Filter by month
        if (month !== "all") {
          const recordDate = new Date(record.date);
          const recordMonth = recordDate.getMonth(); // 0-11 for Jan-Dec
          if (recordMonth !== MONTHS.indexOf(month)) {
            return false;
          }
        }

        // Filter by year
        if (year !== "all") {
          const recordDate = new Date(record.date);
          const recordYear = recordDate.getFullYear().toString();
          if (recordYear !== year) {
            return false;
          }
        }

        // Filter by cutoff
        if (cutoff !== "all" && record.cutoff !== cutoff) {
          return false;
        }

        return true;
      });

      // Sort by year, then month, then day
      return filteredData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // First sort by year
        const yearDiff = dateA.getFullYear() - dateB.getFullYear();
        if (yearDiff !== 0) return yearDiff;

        // Then by month
        const monthDiff = dateA.getMonth() - dateB.getMonth();
        if (monthDiff !== 0) return monthDiff;

        // Finally by day
        return dateA.getDate() - dateB.getDate();
      });
    },
  });
}

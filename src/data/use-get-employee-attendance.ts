import { getEmployeeAttendance } from "@/db/functions/employee";
import { useQuery } from "@tanstack/react-query";

interface AttendanceFilters {
  employeeId?: string;
  month?: string;
  year?: string;
}

export default function useGetEmployeeAttendance(
  filters: AttendanceFilters = {}
) {
  const { employeeId = "all", month = "all", year = "all" } = filters;

  return useQuery({
    queryKey: ["employees-attendance", filters],
    queryFn: async () => getEmployeeAttendance(),
    select: (data) => {
      if (!data) return data;

      return data.filter((record) => {
        // Filter by employee
        if (employeeId !== "all" && record.employeeId !== employeeId) {
          return false;
        }

        // Filter by month
        if (month !== "all") {
          const recordDate = new Date(record.date);
          const recordMonth = recordDate.toLocaleString("default", {
            month: "long",
          });
          if (recordMonth !== month) {
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

        return true;
      });
    },
  });
}

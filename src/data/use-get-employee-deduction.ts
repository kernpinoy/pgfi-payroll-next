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
    queryKey: ["employee-deduction", employeeId, month, year, cutoff ?? "all"],
    queryFn: async () => getDeductionsPerEmployee(employeeId, month, year),
    enabled: !!employeeId,
  });
}

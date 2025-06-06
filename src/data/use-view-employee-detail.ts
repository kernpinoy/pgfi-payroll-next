import { getEmployees } from "@/db/functions/employee";
import { useQuery } from "@tanstack/react-query";

export default function useViewEmployeeDetail(employeeId: string) {
  return useQuery({
    queryKey: ["employees-list"],
    queryFn: async () => getEmployees(),
    select: (data) => data.find((employee) => employee.id === employeeId),
    enabled: !!employeeId, // Only run the query if employeeId is provided
  });
}

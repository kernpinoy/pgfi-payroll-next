import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/db/functions/employee";

export default function useGetEmployeeDetails() {
  return useQuery({
    queryKey: ["employees-list"],
    queryFn: async () => getEmployees(),
  });
}

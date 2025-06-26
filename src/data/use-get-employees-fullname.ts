import { getEmployees } from "@/db/functions/employee";
import { useQuery } from "@tanstack/react-query";

export default function useGetEmployeesFullName() {
  return useQuery({
    queryKey: ["employees-list"],
    queryFn: async () => getEmployees(),
    select: (employees) =>
      employees.map(({ id, fullName }) => ({ id, fullName })),
  });
}

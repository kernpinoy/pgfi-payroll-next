import { validateRequest } from "@/lib/validate-request";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import EmployeesClient from "./_components/employees-client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getEmployees } from "@/db/functions/employee";

export const metadata: Metadata = {
  title: "PGFI Payroll - Employees",
  description: "PGFI Payroll - Employees",
};

export default async function EmployeesPage() {
  const { session, user } = await validateRequest();

  if (!session || !user) redirect("/");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["employees-list"],
    queryFn: getEmployees,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployeesClient />
    </HydrationBoundary>
  );
}

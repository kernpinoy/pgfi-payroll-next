import { getEmployees } from "@/db/functions/employee";
import { validateRequest } from "@/lib/validate-request";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import EditEmployeeClient from "./_components/edit-employee-client";

export default async function EmployeeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { session, user } = await validateRequest();
  const { id } = await params;
  if (!user || !session) {
    redirect("/");
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["employees-list"],
    queryFn: getEmployees,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditEmployeeClient employeeId={id} />
    </HydrationBoundary>
  );
}

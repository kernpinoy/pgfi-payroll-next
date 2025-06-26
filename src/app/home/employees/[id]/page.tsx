import { getEmployees } from "@/db/functions/employee";
import { validateRequest } from "@/lib/validate-request";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import ViewEmployeeDetails from "./_components/view-employee-details";

export default async function EmployeeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { session, user } = await validateRequest();

  if (!session || !user) {
    redirect("/");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["employees-list"],
    queryFn: getEmployees,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ViewEmployeeDetails employeeId={id} />
    </HydrationBoundary>
  );
}

import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";
import AttendanceClient from "./_components/attendance-client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getEmployeeAttendance, getEmployees } from "@/db/functions/employee";

export default async function AttendancePage() {
  const { session, user } = await validateRequest();

  if (!session || !user) {
    redirect("/");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["employees-list"],
    queryFn: getEmployees,
  });

  await queryClient.prefetchQuery({
    queryKey: ["employees-attendance"],
    queryFn: getEmployeeAttendance,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AttendanceClient />
    </HydrationBoundary>
  );
}

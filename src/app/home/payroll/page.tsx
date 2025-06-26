import { validateRequest } from "@/lib/validate-request";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import PayrollClient from "./_components/payroll-client";

export default async function PayrollPage() {
  const { session, user } = await validateRequest();

  if (!session || !user) {
    redirect("/");
  }

  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PayrollClient />
    </HydrationBoundary>
  );
}

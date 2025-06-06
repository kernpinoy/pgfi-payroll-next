"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, AlertTriangle, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import useGetEmployeeDetails from "@/data/use-get-employee-details";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import Loading from "../../employees/loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const EmployeeAddForm = dynamic(() => import("./employee-add-form"), {
  ssr: true, // Typically modals don't need SSR
});

export default function EmployeesClient() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError } = useGetEmployeeDetails();
  const router = useRouter();

  const employees = useMemo(
    () =>
      data?.map((item) => ({
        employeeId: item.employeeId,
        id: item.id,
        fullName: item.fullName,
        contactNumber: item.contactNo,
        email: item.email,
      })) ?? [],
    [data]
  );

  function handleRefresh() {
    router.refresh();
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="p-8 space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading employee data. Please try again or
            contact support.
          </AlertDescription>
        </Alert>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh page
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 md:p-4">
        <Button onClick={() => setIsOpen(!isOpen)}>
          <PlusIcon />
          Add Employee
        </Button>
      </div>

      <div className="p-8 md:p-4">
        <DataTable columns={columns} data={employees} />
      </div>

      <EmployeeAddForm open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

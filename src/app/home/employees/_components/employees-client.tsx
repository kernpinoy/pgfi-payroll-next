"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import useGetEmployeeDetails from "@/data/use-get-employee-details";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";

const EmployeeAddForm = dynamic(() => import("./employee-add-form"), {
  ssr: false, // Typically modals don't need SSR
});

export default function EmployeesClient() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGetEmployeeDetails();
  const employees = data!.map((item) => ({
    id: item.id,
    fullName: item.fullName,
    contactNumber: item.contactNo,
    email: item.email,
  }));

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

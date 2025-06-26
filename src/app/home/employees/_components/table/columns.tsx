"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import EmployeeActionDropdown from "./employee-action-dropdown";

export type Employee = {
  id: string;
  employeeId: string;
  fullName: string;
  contactNumber: string;
};

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const { fullName, id } = row.original;
      return (
        <Link
          href={`/home/employees/${id}`}
          className="hover:underline"
          prefetch={true}
        >
          {fullName}
        </Link>
      );
    },
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const val = row.original;

      return <EmployeeActionDropdown key={val.id} {...val} />;
    },
  },
];

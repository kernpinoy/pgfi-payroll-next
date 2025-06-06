import { useState } from "react";
import { Employee } from "./columns";
import DeleteEmployeeForm from "./delete-employee-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Trash2, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmployeeActionDropdown(employee: Employee) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DeleteEmployeeForm
        employee={employee}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-right h-8 w-8 p-0">
            <span className="sr-only">Open actions</span>
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:cursor-pointer transition-colors"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4 hover:stroke-red-500/80 stroke-red-500 shadow-none filter-none" />
            <span>Delete employee profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer transition-colors"
            asChild
          >
            <Link href={`/home/employees/${employee.id}`} prefetch={true}>
              <Eye className="h-4 w-4 hover:text-primary/80 text-primary shadow-none filter-none" />
              <span>View employee profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer transition-colors"
            asChild
          >
            <Link href={`/home/employees/${employee.id}/edit`} prefetch={true}>
              <Pencil className="h-4 w-4 text-amber-600 hover:text-amber-700 shadow-none filter-none" />
              <span>Edit employee profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

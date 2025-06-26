"use client";

import { ComponentProps } from "react";
import type { Employee } from "./columns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { deleteEmployeeAction } from "../action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteEmployeeFormProps extends ComponentProps<typeof Dialog> {
  employee: Employee;
}

export default function DeleteEmployeeForm({
  employee,
  ...props
}: DeleteEmployeeFormProps) {
  const queryClient = useQueryClient();
  const { execute, status } = useAction(deleteEmployeeAction, {
    onSuccess: ({ data }) => {
      if (data?.success === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["employees-list"] });
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
  });

  function handleDelete() {
    execute({ id: employee.id });
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Employee profile</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {employee.fullName}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="hover:cursor-pointer transition-colors"
              disabled={status === "executing"}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="hover:cursor-pointer transition-colors"
            disabled={status === "executing"}
            onClick={handleDelete}
          >
            {status === "executing" ? "Deleting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

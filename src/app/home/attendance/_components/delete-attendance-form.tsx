"use client";

import { ComponentProps } from "react";
import type { Attendance } from "@/db/schema";
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
import { deleteAttendanceAction } from "./action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

interface DeleteAttendanceFormProps extends ComponentProps<typeof Dialog> {
  attendance: Attendance;
  employeeName?: string;
}

export default function DeleteAttendanceForm({
  attendance,
  employeeName = "Unknown Employee",
  ...props
}: DeleteAttendanceFormProps) {
  const queryClient = useQueryClient();
  const { execute, status } = useAction(deleteAttendanceAction, {
    onSuccess: ({ data }) => {
      if (data?.success === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["employees-attendance"],
        });
        queryClient.invalidateQueries({
          queryKey: ["attendance-list", "employee-attendance"],
        });
        queryClient.invalidateQueries({
          queryKey: ["employee-deduction"],
        });
        props.onOpenChange?.(false);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
  });

  function handleDelete() {
    execute({ id: attendance.id });
  }

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "MMMM dd, yyyy");
  };

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Attendance Record</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the attendance record for{" "}
            <strong>{employeeName}</strong> on{" "}
            <strong>{formatDate(attendance.date)}</strong>? This action cannot
            be undone.
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
            variant="destructive"
            className="hover:cursor-pointer transition-colors"
            disabled={status === "executing"}
            onClick={handleDelete}
          >
            {status === "executing" ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

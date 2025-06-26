import useViewAttendanceDetail from "@/data/use-view-attendance-detail";
import {
  EditAttendanceFormValues,
  editAttendanceSchema,
} from "@/validation/edit-attendance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useEditAttendanceForm(
  data: ReturnType<typeof useViewAttendanceDetail>["data"]
) {
  return useForm<EditAttendanceFormValues>({
    resolver: zodResolver(editAttendanceSchema),
    defaultValues: {
      id: data?.id || "",
      employeeId: data?.employeeId || "",
      date: data?.date ? new Date(data.date) : undefined,
      cutoff: data?.cutoff || "a",
      timeIn: data?.timeIn || "",
      timeOut: data?.timeOut || "",
      regularHoliday: data?.regularHoliday || false,
      specialNonWorkingHoliday: data?.specialNonWorkingHoliday || false,
      undertime: data?.undertime || false,
      overtime: data?.overtime || false,
      overtimeHours: data?.overtimeHours || 0,
    },
  });
}

import { addAttendanceSchema } from "@/validation/add-attendance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

function useAddAttendanceForm() {
  return useForm({
    resolver: zodResolver(addAttendanceSchema),
    defaultValues: {
      date: new Date(),
      employeeId: "",
      cutoff: "a" as const,
      timeIn: "",
      timeOut: "",
      overtime: false,
      overtimeHours: 0,
      regularHoliday: false,
      specialNonWorkingHoliday: false,
      undertime: false,
    },
  });
}

type AddAttendanceFormSchema = z.infer<typeof addAttendanceSchema>;

export { useAddAttendanceForm, type AddAttendanceFormSchema };

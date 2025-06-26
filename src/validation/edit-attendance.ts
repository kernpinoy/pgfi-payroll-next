import { z } from "zod";

export const editAttendanceSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Date must be a valid date",
  }),
  cutoff: z.enum(["a", "b"], {
    required_error: "Cutoff is required",
    invalid_type_error: "Cutoff must be either 'a' or 'b'",
  }),
  timeIn: z.string().min(1, "Time In is required"),
  timeOut: z.string().min(1, "Time Out is required"),
  regularHoliday: z.boolean(),
  specialNonWorkingHoliday: z.boolean(),
  undertime: z.boolean(),
  overtime: z.boolean(),
  overtimeHours: z.number().min(0),
});

export type EditAttendanceFormValues = z.infer<typeof editAttendanceSchema>;

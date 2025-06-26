import { z } from "zod";

export const addAttendanceSchema = z.object({
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
  regularHoliday: z.boolean().default(false),
  specialNonWorkingHoliday: z.boolean().default(false),
  undertime: z.boolean().default(false),
  overtime: z.boolean().default(false),
  overtimeHours: z.number().min(0).default(0),
});

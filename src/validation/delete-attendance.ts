import { z } from "zod";

export const deleteAttendanceSchema = z.object({
  id: z.string().uuid("Invalid attendance ID"),
});

export type DeleteAttendanceFormValues = z.infer<typeof deleteAttendanceSchema>;

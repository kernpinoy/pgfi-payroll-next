"use server";

import { db } from "@/db";
import { attendance } from "@/db/schema";
import { editAttendanceSchema } from "@/validation/edit-attendance";
import { actionClient } from "@/lib/action-client";
import { eq } from "drizzle-orm";

export const updateAttendanceAction = actionClient
  .schema(editAttendanceSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Check if attendance with same employee, date, and cutoff already exists (excluding current record)
      const existingAttendance = await db
        .select()
        .from(attendance)
        .where(eq(attendance.employeeId, parsedInput.employeeId));

      // Filter out the current record being edited and check for duplicates
      const duplicateAttendance = existingAttendance.filter(
        (record) =>
          record.id !== parsedInput.id &&
          record.date === parsedInput.date.toISOString().split("T")[0] &&
          record.cutoff === parsedInput.cutoff
      );

      if (duplicateAttendance.length > 0) {
        return {
          success: false,
          message:
            "Attendance for this employee, date, and cutoff already exists.",
        };
      }

      // Update the attendance record
      await db
        .update(attendance)
        .set({
          employeeId: parsedInput.employeeId,
          date: parsedInput.date.toISOString().split("T")[0],
          cutoff: parsedInput.cutoff,
          timeIn: parsedInput.timeIn,
          timeOut: parsedInput.timeOut,
          regularHoliday: parsedInput.regularHoliday,
          specialNonWorkingHoliday: parsedInput.specialNonWorkingHoliday,
          undertime: parsedInput.undertime,
          overtime: parsedInput.overtime,
          overtimeHours: parsedInput.overtimeHours,
        })
        .where(eq(attendance.id, parsedInput.id));

      return {
        success: true,
        message: "Attendance updated successfully!",
      };
    } catch (error) {
      console.error("Error updating attendance:", error);
      return {
        success: false,
        message: "Failed to update attendance. Please try again.",
      };
    }
  });

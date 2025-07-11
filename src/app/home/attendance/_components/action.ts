"use server";

import { db } from "@/db";
import { attendance } from "@/db/schema";
import { ActionError, authActionClient } from "@/lib/action-client";
import { addAttendanceSchema } from "@/validation/add-attendance";
import { deleteAttendanceSchema } from "@/validation/delete-attendance";
import { and, eq } from "drizzle-orm";

export const addAttendanceAction = authActionClient
  .schema(addAttendanceSchema)
  .action(async ({ parsedInput }) => {
    const input: typeof attendance.$inferInsert = {
      employeeId: parsedInput.employeeId,
      cutoff: parsedInput.cutoff,
      date: parsedInput.date.toISOString().split("T")[0],
      timeIn: parsedInput.timeIn,
      timeOut: parsedInput.timeOut,
      regularHoliday: parsedInput.regularHoliday,
      specialNonWorkingHoliday: parsedInput.specialNonWorkingHoliday,
      undertime: parsedInput.undertime,
      overtime: parsedInput.overtime,
      overtimeHours: parsedInput.overtimeHours,
      breakTimeHours: parsedInput.breakTimeHours,
    };

    // check for duplicate attendance first before inserting
    const existingAttendance = await db.query.attendance.findFirst({
      where: and(
        eq(attendance.employeeId, parsedInput.employeeId),
        eq(attendance.date, parsedInput.date.toISOString().split("T")[0])
      ),
    });

    if (existingAttendance) {
      throw new ActionError(
        "Attendance for this employee on this date already exists."
      );
    }

    // insert attendance with transaction
    const [result] = await db.transaction(async (tx) => {
      return await tx.insert(attendance).values(input).returning();
    });

    // If no result is returned, throw an error
    if (!result) {
      throw new ActionError("Failed to add attendance. Please try again.");
    }

    // sumakses
    return {
      success: true,
      message: "Attendance added successfully.",
      result,
    };
  });

export const deleteAttendanceAction = authActionClient
  .schema(deleteAttendanceSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;

    // Check if the attendance record exists
    const existingAttendance = await db.query.attendance.findFirst({
      where: eq(attendance.id, id),
    });

    if (!existingAttendance) {
      throw new ActionError("Attendance record not found.");
    }

    // Delete the attendance record
    const [result] = await db.transaction(async (tx) => {
      return await tx
        .delete(attendance)
        .where(eq(attendance.id, id))
        .returning();
    });

    if (!result) {
      throw new ActionError(
        "Failed to delete attendance record. Please try again."
      );
    }

    return {
      success: true,
      message: "Attendance record deleted successfully.",
      result,
    };
  });

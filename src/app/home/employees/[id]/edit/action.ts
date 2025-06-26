"use server";

import { db } from "@/db";
import { employees } from "@/db/schema";
import { ActionError, authActionClient } from "@/lib/action-client";
import { editEmployeeSchema } from "@/validation/edit-employee";
import { eq } from "drizzle-orm";

export const updateEmployeeAction = authActionClient
  .schema(editEmployeeSchema)
  .action(async ({ parsedInput }) => {
    // Check if employee exists first
    const existingEmployee = await db.query.employees.findFirst({
      where: eq(employees.id, parsedInput.id),
    });

    if (!existingEmployee) {
      throw new ActionError("Employee not found.");
    }

    const [employee] = await db.transaction(async (tx) => {
      return await tx
        .update(employees)
        .set(parsedInput)
        .where(eq(employees.id, parsedInput.id))
        .returning();
    });

    if (!employee) {
      throw new ActionError("Failed to update the employee.");
    }

    return {
      success: true,
      message: "Employee information updated successfully.",
      employee,
    };
  });

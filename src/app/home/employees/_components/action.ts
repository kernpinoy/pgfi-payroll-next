"use server";

import { db } from "@/db";
import { employees } from "@/db/schema";
import { ActionError, authActionClient } from "@/lib/action-client";
import addEmployeeSchema from "@/validation/add-employee";

export const addEmployeeAction = authActionClient
  .schema(addEmployeeSchema)
  .action(async ({ parsedInput }) => {
    const [employee] = await db.transaction(async (tx) => {
      return await tx.insert(employees).values(parsedInput).returning();
    });

    console.log("parsedInput:", parsedInput);
    console.log("Employee added:", employee);

    if (!employee) {
      throw new ActionError("Failed to add an employee.");
    }

    return {
      success: true,
      message: "Employee updated successfully.",
      employee,
    };
  });

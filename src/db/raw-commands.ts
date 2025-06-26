import { sql } from "drizzle-orm";
import { employees } from "./schema";

export const employeeFullName = sql<string>`CONCAT(
    ${employees.firstName},
    ' ',
    CASE
        WHEN ${employees.middleName} IS NOT NULL AND ${employees.middleName} <> ''
            THEN CONCAT(LEFT(${employees.middleName}, 1), '. ')
        ELSE ''
    END,
    ${employees.lastName}
)`;

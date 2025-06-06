import { z } from "zod";

const deleteEmployeeSchema = z.object({
  id: z.string().uuid(),
});

export default deleteEmployeeSchema;

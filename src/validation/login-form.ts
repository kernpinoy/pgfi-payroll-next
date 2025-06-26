import { z } from "zod";

const loginFormSchema = z.object({
  username: z
    .string()
    .trim()
    .max(50, "Username must be 50 characters or fewer.")
    .nonempty("Username cannot be empty."),
  password: z
    .string()
    .trim()
    .max(50, "Password must be 50 characters or fewer.")
    .nonempty("Password cannot be empty."),
});

export default loginFormSchema;

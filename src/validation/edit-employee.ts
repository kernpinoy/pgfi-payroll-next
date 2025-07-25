import z from "zod";

const philippineContactNoRegex = /^(?:\+63|0)9\d{9}$/;

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export const editEmployeeSchema = z.object({
  id: z.string().uuid(),
  firstName: z
    .string()
    .min(1, "First name is required.")
    .trim()
    .transform(toTitleCase),
  middleName: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? toTitleCase(val) : val)),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .trim()
    .transform(toTitleCase),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  contactNo: z
    .string()
    .min(1, "Contact number is required.")
    .trim()
    .regex(
      philippineContactNoRegex,
      "Contact number must be valid (e.g., +639171234567 or 09171234567)."
    ),
  email: z.string().email("Invalid email address.").trim(),
  employeeId: z.string().min(1, "Employee ID is required.").trim(),
  address: z
    .string()
    .min(1, "Address is required.")
    .trim()
    .transform((val) => val.toUpperCase()),
  workRate: z
    .number({
      coerce: true,
      message: "Work rate must be a valid number.",
    })
    .min(0, "Work rate must be a positive number.")
    .optional(),
  bankName: z.string().trim().optional(),
  bankNumber: z.string().trim().optional(),
  sss: z.string().trim().optional(),
  phic: z.string().trim().optional(),
  hdmfMid: z.string().trim().optional(),
  tin: z.string().trim().optional(),
});

export type EditEmployeeFormValues = z.infer<typeof editEmployeeSchema>;

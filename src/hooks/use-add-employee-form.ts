import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import addEmployeeSchema from "@/validation/add-employee";
import { z } from "zod";

function useAddEmployeeFormSchema() {
  return useForm({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      firstName: "",
      middleName: undefined,
      lastName: "",
      dateOfBirth: new Date(),
      contactNo: "",
      email: "",
      employeeId: "",
      address: "",
      workRate: undefined,
      bankName: undefined,
      bankNumber: undefined,
      sss: undefined,
      phic: undefined,
      hdmfMid: undefined,
      tin: undefined,
    },
  });
}

type AddEmployeeFormSchema = z.infer<typeof addEmployeeSchema>;

export { useAddEmployeeFormSchema, type AddEmployeeFormSchema };

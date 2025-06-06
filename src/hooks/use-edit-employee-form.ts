import useViewEmployeeDetail from "@/data/use-view-employee-detail";
import {
  EditEmployeeFormValues,
  editEmployeeSchema,
} from "@/validation/edit-employee";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useEditEmployeeForm(
  data: ReturnType<typeof useViewEmployeeDetail>["data"]
) {
  return useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      id: data?.id || "",
      firstName: data?.firstName || "",
      middleName: data?.middleName || "",
      lastName: data?.lastName || "",
      dateOfBirth: data?.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      contactNo: data?.contactNo || "",
      email: data?.email || "",
      employeeId: data?.employeeId || "",
      address: data?.address || "",
      workRate: data?.workRate || undefined,
      bankName: data?.bankName || "",
      bankNumber: data?.bankNumber || "",
      sss: data?.sss || "",
      phic: data?.phic || "",
      hdmfMid: data?.hdmfMid || "",
      tin: data?.tin || "",
    },
  });
}

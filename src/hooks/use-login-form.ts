import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import loginFormSchema from "@/validation/login-form";

function useLoginFormSchema() {
  return useForm<Login>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
}
type Login = z.infer<typeof loginFormSchema>;

export { useLoginFormSchema, type Login };

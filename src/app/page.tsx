import LoginForm from "@/components/login/login-form";
import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";

export default async function Home() {
  const { session, user } = await validateRequest();

  if (session && user) redirect("/home");

  return <LoginForm />;
}

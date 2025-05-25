"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormLabel,
  FormControl,
  FormItem,
  FormDescription,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginFormSchema, type Login } from "@/hooks/use-login-form";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginAccountAction } from "./action";

export default function LoginForm() {
  const router = useRouter();
  const form = useLoginFormSchema();

  const { execute, status } = useAction(loginAccountAction, {
    onSuccess({ data }) {
      toast.success(data?.message, { duration: 1000 });

      if (data?.success) {
        router.replace("/home");
      }
    },
    onError({ error }) {
      toast.error(error.serverError);
    },
  });

  function onSubmit(values: Login) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-screen items-center justify-center p-4">
          <Card
            className="w-full max-w-sm"
            onMouseEnter={() => router.prefetch("/home")}
          >
            <CardHeader>
              <CardTitle className="font-bold text-2xl text-center">
                PGFI Payroll
              </CardTitle>
              <CardDescription className="font-light text-center text-sm text-muted-foreground">
                Please enter your username and password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div className="grid gap-1.5">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Username"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your username here.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1.5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your password here.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={status === "executing" || !form.formState.isDirty}
                className="w-full cursor-pointer"
              >
                {status === "executing" ? "Logging in..." : "Log in"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
}

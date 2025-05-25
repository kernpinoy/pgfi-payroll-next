"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AddEmployeeFormSchema,
  useAddEmployeeFormSchema,
} from "@/hooks/use-add-employee-form";
import { ComponentProps, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DatePicker } from "@/components/date-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAction } from "next-safe-action/hooks";
import { addEmployeeAction } from "./action";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const toastId = "add-employee-toast";

export default function EmployeeAddForm({
  ...props
}: ComponentProps<typeof Dialog>) {
  const form = useAddEmployeeFormSchema();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Reset the form when the dialog is closed
    if (!props.open) {
      form.reset();
    }
  }, [form, props.open]);

  function onSubmit(data: AddEmployeeFormSchema) {
    execute(data);
  }

  const { execute, status } = useAction(addEmployeeAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.message, {
          id: toastId,
          description: "Employee added successfully.",
        });

        form.reset();
        queryClient.invalidateQueries({
          queryKey: ["employees-list"],
        });
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError, {
        id: toastId,
        description: "Failed to add employee.",
      });
    },
  });

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new employee to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="h-[50vh] overflow-hidden relative">
              <ScrollArea className="h-full pr-4 absolute inset-0">
                <div className="space-y-4 pb-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the first name of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Middle Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the middle name of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the last name of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="z-50">
                        <FormLabel>Date of birth</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select the date of birth."
                          />
                        </FormControl>
                        <FormDescription>
                          Select the date of birth of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact number</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the contact number of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="z-50">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the email address of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Employee ID" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the employee ID of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Address" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the address of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Rate</FormLabel>
                        <FormControl>
                          <Input placeholder="Work Rate" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the work rate of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Bank Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the bank name of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Bank Number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the bank number of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sss"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SSS</FormLabel>
                        <FormControl>
                          <Input placeholder="SSS" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the SSS number of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PHIC</FormLabel>
                        <FormControl>
                          <Input placeholder="PHIC" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the PHIC number of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hdmfMid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HDMF (MID)</FormLabel>
                        <FormControl>
                          <Input placeholder="HDMF (MID)" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the HDMF (MID) number of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TIN</FormLabel>
                        <FormControl>
                          <Input placeholder="TIN" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the TIN number of the employee.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
            </div>

            <DialogFooter>
              <Button disabled={status === "executing"} type="submit">
                {status === "executing" ? "Adding employee..." : "Add Employee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

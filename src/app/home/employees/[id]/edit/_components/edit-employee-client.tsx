"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useViewEmployeeDetail from "@/data/use-view-employee-detail";
import { EditEmployeeFormValues } from "@/validation/edit-employee";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAction } from "next-safe-action/hooks";
import { updateEmployeeAction } from "../action";
import { toast } from "sonner";
import { useEffect } from "react";
import Loading from "../loading";
import { useEditEmployeeForm } from "@/hooks/use-edit-employee-form";

export default function EditEmployeeClient({
  employeeId,
}: {
  employeeId: string;
}) {
  const { data, isLoading, isError } = useViewEmployeeDetail(employeeId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { execute, status } = useAction(updateEmployeeAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.message);
        form.reset(form.getValues(), { keepValues: true });
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["employees-list", "employee-deduction"],
          });
          queryClient.invalidateQueries({
            queryKey: ["employee-deduction"],
          });
        }, 100);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
  });

  const form = useEditEmployeeForm(data);

  function handleSubmit(data: EditEmployeeFormValues) {
    console.log("Submitting form with data:", data);
    execute(data);
  }

  // Reset form when data changes (including after successful update)
  useEffect(() => {
    if (status === "executing") {
      // If currently executing, do not reset form
      return;
    }

    if (data) {
      const formValues = {
        id: data.id || "",
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        lastName: data.lastName || "",
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        contactNo: data.contactNo || "",
        email: data.email || "",
        employeeId: data.employeeId || "",
        address: data.address || "",
        workRate: data.workRate || undefined,
        bankName: data.bankName || "",
        bankNumber: data.bankNumber || "",
        sss: data.sss || "",
        phic: data.phic || "",
        hdmfMid: data.hdmfMid || "",
        tin: data.tin || "",
      };

      // Only reset the form when status is not idle (executing is not a valid status)
      if (status !== "idle") {
        // Reset form with fresh data and mark as not dirty
        form.reset(formValues, {
          keepErrors: false,
          keepDirty: false,
          keepIsSubmitted: false,
        });
      }
    }
  }, [data, form, status]); // Also depend on status to reset after successful submission

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Employee</h1>
        </div>

        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-1 hover:cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Go back
          </Button>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the employee data. Please try again or
            contact support if the problem persists.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => router.refresh()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 mt-8">
        <h1 className="text-3xl font-bold">Edit Employee</h1>
        <p className="text-muted-foreground mt-1">
          Update employee information
        </p>
      </div>

      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1 hover:cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Go back
        </Button>
      </div>

      {/* Make the ScrollArea a bit shorter to accommodate the button below */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-10">
          <ScrollArea className="h-[calc(100vh-400px)] pr-4">
            <div className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-xl font-semibold border-b pb-2 mb-6">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormLabel className="hidden"></FormLabel>
                        <FormControl>
                          <Input
                            type="hidden"
                            value={field.value}
                            name={field.name}
                            className="hidden"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Middle Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter middle name"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="z-50">
                        <FormLabel className="text-base">
                          Date of Birth
                        </FormLabel>
                        <FormControl className="h-11">
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select the date of birth."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Employee ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter employee ID"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/** contact information section */}
              <div>
                <h2 className="text-xl font-semibold border-b pb-2 mb-6">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Contact Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., +639171234567 or 09171234567"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter complete address"
                          className="min-h-[50px] text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Employment Information Section */}
              <div>
                <h2 className="text-xl font-semibold border-b pb-2 mb-6">
                  Employment Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name="workRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Work Rate (₱)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter work rate"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Bank Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter bank name"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Bank Account Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter bank account number"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Government IDs Section */}
              <div>
                <h2 className="text-xl font-semibold border-b pb-2 mb-6">
                  Government IDs
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sss"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">SSS Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter SSS number"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          PhilHealth Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter PhilHealth number"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hdmfMid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Pag-IBIG MID Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Pag-IBIG MID number"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">TIN</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter TIN"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Remove submit button from here */}
          </ScrollArea>

          {/* Add button outside of ScrollArea but still in the normal flow */}
          <div className="mt-6 pb-4 border-t pt-6">
            <div className="flex justify-end">
              <Button
                type="submit"
                className="px-8 py-6 text-base hover:cursor-pointer"
                disabled={status === "executing" || !form.formState.isDirty}
              >
                {status === "executing" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetEmployeesFullName from "@/data/use-get-employees-fullname";
import { Calendar, Save, User } from "lucide-react";
import Loading from "../loading";
import {
  type AddAttendanceFormSchema,
  useAddAttendanceForm,
} from "@/hooks/use-add-attendance-form";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWatch } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { addAttendanceAction } from "./action";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function AddAttendanceForm() {
  const { data, isLoading, isError } = useGetEmployeesFullName();
  const queryClient = useQueryClient();
  const form = useAddAttendanceForm();
  const watchedValues = useWatch({
    control: form.control,
    name: [
      "employeeId",
      "regularHoliday",
      "specialNonWorkingHoliday",
      "undertime",
      "overtime",
      "overtimeHours",
    ],
  });

  const handleDateChange = (
    date: Date | undefined,
    onChange: (value: Date | undefined) => void
  ) => {
    if (date) {
      // Get the date string in YYYY-MM-DD format
      const dateString = format(date, "yyyy-MM-dd");
      // Parse it back as UTC midnight to avoid timezone issues
      const utcDate = new Date(`${dateString}T00:00:00.000Z`);
      onChange(utcDate);

      const dayOfMonth = date.getDate();

      if (dayOfMonth <= 15) {
        form.setValue("cutoff", "a");
      } else {
        form.setValue("cutoff", "b");
      }
    } else {
      onChange(date);
    }
  };

  const { execute, status } = useAction(addAttendanceAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["attendance-list", "employee-attendance"],
        });
        queryClient.invalidateQueries({
          queryKey: ["employees-attendance"],
        });
        queryClient.invalidateQueries({
          queryKey: ["employee-deduction"],
        });

        // Keep the current employeeId when resetting
        const currentEmployeeId = form.getValues("employeeId");
        form.reset({
          employeeId: currentEmployeeId,
          date: new Date(),
          cutoff: "a",
          timeIn: "",
          timeOut: "",
          regularHoliday: false,
          specialNonWorkingHoliday: false,
          undertime: false,
          overtime: false,
          overtimeHours: 0,
        });
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to add attendance.");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  function handleSubmit(data: AddAttendanceFormSchema) {
    execute(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 px-1"
      >
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/** select employee name and attendance (burger) */}
          <Card className="flex-1 min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Employee & Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Employees</SelectLabel>
                          {data?.map((employee) => (
                            <SelectItem
                              key={employee.id}
                              value={employee.id}
                              className="transition-colors"
                            >
                              {employee.fullName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(date) =>
                          handleDateChange(date, field.onChange)
                        }
                        placeholder="Select date"
                        endYear={new Date().getFullYear() + 1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cutoff"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cutoff Period</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cutoff period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Cutoff Periods</SelectLabel>
                          <SelectItem value="a">Cutoff A</SelectItem>
                          <SelectItem value="b">Cutoff B</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/** Time in n out */}
          <Card className="flex-1 min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Time Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="timeIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time In</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Out</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breakTimeHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Break Time Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.25"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value) || 1)
                        }
                        placeholder="1.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/** Additional details */}
          <Card className="flex-1 min-w-0">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Day Type</Label>

                <FormField
                  control={form.control}
                  name="regularHoliday"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-normal">
                          Regular Holiday
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue("specialNonWorkingHoliday", false);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialNonWorkingHoliday"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-normal">
                          Special Non-Working Holiday
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue("regularHoliday", false);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="undertime"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-normal">
                          Undertime
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue("overtime", false);
                              form.setValue("overtimeHours", 0);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="overtime"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-normal">
                          Overtime
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue("undertime", false);
                            } else {
                              form.setValue("overtimeHours", 0);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="overtimeHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Overtime Hours
                        {!watchedValues[4] && (
                          <span className="text-muted-foreground text-xs ml-1">
                            (Overtime must be enabled)
                          </span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.25"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          disabled={!watchedValues[4]}
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button
                  type="submit"
                  disabled={
                    !form.formState.isDirty ||
                    !watchedValues[0] ||
                    status === "executing"
                  }
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {status === "executing" ? "Saving..." : "Save Attendance"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}

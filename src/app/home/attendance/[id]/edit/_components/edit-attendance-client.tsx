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
import useViewAttendanceDetail from "@/data/use-view-attendance-detail";
import { Calendar, Save, User, ArrowLeft, Loader2 } from "lucide-react";
import Loading from "../loading";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWatch } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { updateAttendanceAction } from "../action";
import { useEditAttendanceForm } from "@/hooks/use-edit-attendance-form";
import { EditAttendanceFormValues } from "@/validation/edit-attendance";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { format } from "date-fns";

export default function EditAttendanceClient({
  attendanceId,
}: {
  attendanceId: string;
}) {
  const {
    data: employeesData,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useGetEmployeesFullName();
  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    isError: attendanceError,
  } = useViewAttendanceDetail(attendanceId);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { execute, status } = useAction(updateAttendanceAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.message);
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["attendance-list", "employee-attendance"],
          });
          queryClient.invalidateQueries({
            queryKey: ["employees-attendance"],
          });
          queryClient.invalidateQueries({
            queryKey: ["employee-deduction"],
          });
          queryClient.invalidateQueries({
            queryKey: ["attendance-detail", attendanceId],
          });
        }, 100);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to update attendance.");
    },
  });

  const form = useEditAttendanceForm(attendanceData);

  const watchedValues = useWatch({
    control: form.control,
    name: [
      "regularHoliday",
      "specialNonWorkingHoliday",
      "undertime",
      "overtime",
      "overtimeHours",
    ],
  });

  // Reset form when data changes (including after successful update)
  useEffect(() => {
    if (status === "executing") {
      return;
    }

    if (attendanceData) {
      const formValues = {
        id: attendanceData.id || "",
        employeeId: attendanceData.employeeId || "",
        date: attendanceData.date ? new Date(attendanceData.date) : undefined,
        cutoff: attendanceData.cutoff || "a",
        timeIn: attendanceData.timeIn || "",
        timeOut: attendanceData.timeOut || "",
        regularHoliday: attendanceData.regularHoliday || false,
        specialNonWorkingHoliday:
          attendanceData.specialNonWorkingHoliday || false,
        undertime: attendanceData.undertime || false,
        overtime: attendanceData.overtime || false,
        overtimeHours: attendanceData.overtimeHours || 0,
        breakTimeHours: attendanceData.breakTimeHours || 1,
      };

      form.reset(formValues, {
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
      });
    }
  }, [attendanceData, form, status]);

  const handleDateChange = (
    date: Date | undefined,
    onChange: (value: Date | undefined) => void
  ) => {
    if (date) {
      const dateString = format(date, "yyyy-MM-dd");
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

  if (attendanceLoading || employeesLoading) {
    return <Loading />;
  }

  if (attendanceError || employeesError || !attendanceData) {
    return (
      <div className="space-y-6 px-1">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Attendance</h1>
            <p className="text-muted-foreground">
              Error loading attendance data
            </p>
          </div>
        </div>
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Failed to load attendance data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  function handleSubmit(data: EditAttendanceFormValues) {
    execute(data);
  }

  return (
    <div className="space-y-6 px-1">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Attendance</h1>
          <p className="text-muted-foreground">
            Update attendance record for{" "}
            {employeesData?.find((e) => e.id === attendanceData.employeeId)
              ?.fullName || "Unknown Employee"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/** select employee name and attendance */}
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
                  name="id"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <div className="space-y-2">
                        <Input
                          value={
                            employeesData?.find(
                              (e) => e.id === attendanceData.employeeId
                            )?.fullName || "Unknown Employee"
                          }
                          disabled
                          className="bg-muted"
                        />
                        <Input type="hidden" {...field} />
                      </div>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                      <FormLabel>
                        Break Time Hours
                        <span className="text-muted-foreground text-xs ml-1">
                          (Minimum 1 hour)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.25"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 1
                            )
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
                                form.setValue(
                                  "specialNonWorkingHoliday",
                                  false
                                );
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
                          {!watchedValues[3] && (
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
                            disabled={!watchedValues[3]}
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
                    disabled={!form.formState.isDirty || status === "executing"}
                    className="w-full"
                  >
                    {status === "executing" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}

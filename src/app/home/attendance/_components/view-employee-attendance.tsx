"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectValue,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useGetEmployeeAttendance from "@/data/use-get-employee-attendance";
import useGetEmployeesFullName from "@/data/use-get-employees-fullname";
import {
  Filter,
  RefreshCw,
  AlertCircle,
  FileX,
  Calendar,
  MoreHorizontal,
  Trash2,
  SquarePen,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseISO, format, parse } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import DeleteAttendanceForm from "./delete-attendance-form";
import type { Attendance } from "@/db/schema";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ViewEmployeeAttendance() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useGetEmployeesFullName();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    attendance: Attendance | null;
    employeeName: string;
  }>({
    open: false,
    attendance: null,
    employeeName: "",
  });

  // Safely decode query parameters
  const currentEmployeeId = searchParams.get("employeeId")
    ? decodeURIComponent(searchParams.get("employeeId")!)
    : "all";
  const currentMonth = searchParams.get("month")
    ? decodeURIComponent(searchParams.get("month")!)
    : "all";
  const currentYear = searchParams.get("year")
    ? decodeURIComponent(searchParams.get("year")!)
    : "all";

  const {
    data: attendance,
    isLoading,
    error,
    refetch,
  } = useGetEmployeeAttendance({
    employeeId: currentEmployeeId,
    month: currentMonth,
    year: currentYear,
  });

  const badgeText = useMemo(() => {
    const count = attendance ? attendance.length : 0;
    return count === 0
      ? "No records found"
      : `${count} record${count > 1 ? "s" : ""}.`;
  }, [attendance]);

  function setFilterEmployee(employeeId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (employeeId === "all") {
      params.delete("employeeId");
    } else {
      params.set("employeeId", encodeURIComponent(employeeId));
    }
    router.push(`/home/attendance?${params.toString()}`);
  }

  function setFilterMonth(month: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (month === "all") {
      params.delete("month");
    } else {
      params.set("month", encodeURIComponent(month));
    }
    router.push(`/home/attendance?${params.toString()}`);
  }

  function setFilterYear(year: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (year === "all") {
      params.delete("year");
    } else {
      params.set("year", encodeURIComponent(year));
    }
    router.push(`/home/attendance?${params.toString()}`);
  }

  const getEmployeeName = useCallback(
    (id: string) => {
      const employee = data?.find((emp) => emp.id === id);
      return employee ? employee.fullName : "Unknown Employee";
    },
    [data]
  );

  const formatDate = useCallback((dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "MMMM dd, yyyy");
  }, []);

  const formatTime = useCallback((timeString: string) => {
    if (!timeString) return "-";
    const time = parse(timeString, "HH:mm", new Date());
    return format(time, "hh:mm aaa");
  }, []);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear + 5 - 1900 + 1 }, (_, i) => {
      const year = currentYear + 5 - i;
      return (
        <SelectItem key={year} value={year.toString()}>
          {year}
        </SelectItem>
      );
    });
  }, []);

  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-12 w-[150px]" />
          <Skeleton className="h-12 w-[120px]" />
          <Skeleton className="h-12 w-[100px]" />
          <Skeleton className="h-12 w-[100px]" />
          <Skeleton className="h-12 w-[80px]" />
          <Skeleton className="h-12 w-[80px]" />
          <Skeleton className="h-12 w-[80px]" />
          <Skeleton className="h-12 w-[80px]" />
          <Skeleton className="h-12 w-[60px]" />
        </div>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to load attendance records. Please try again.</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="ml-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        No attendance records found
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {currentEmployeeId !== "all" ||
        currentMonth !== "all" ||
        currentYear !== "all"
          ? "No records match your current filters. Try adjusting the filters above."
          : "There are no attendance records in the system yet."}
      </p>
      {(currentEmployeeId !== "all" ||
        currentMonth !== "all" ||
        currentYear !== "all") && (
        <Button
          variant="outline"
          onClick={() => {
            router.push("/home/attendance?tab=view-attendance");
          }}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            {/** Employee filter select */}
            <div className="space-y-2">
              <Label htmlFor="filterEmployee">Employee</Label>
              <Select
                value={currentEmployeeId}
                onValueChange={setFilterEmployee}
              >
                <SelectTrigger id="filterEmployee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="max-h-[250px]">
                    <SelectItem value="all">All Employees</SelectItem>
                    {data?.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.fullName}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            {/** Month filter select */}
            <div className="space-y-2">
              <Label htmlFor="filterMonth">Month</Label>
              <Select value={currentMonth} onValueChange={setFilterMonth}>
                <SelectTrigger id="filterMonth">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    <SelectItem value="all">All Months</SelectItem>
                    {MONTHS.map((month, index) => (
                      <SelectItem key={index} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            {/** Year filter select */}
            <div className="space-y-2">
              <Label htmlFor="filterYear">Year</Label>
              <Select value={currentYear} onValueChange={setFilterYear}>
                <SelectTrigger id="filterYear">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectGroup>{yearOptions}</SelectGroup>
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            {!isLoading && (
              <div className="flex items-end">
                <Badge variant="outline" className="h-fit">
                  {badgeText}.
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            renderLoadingState()
          ) : error ? (
            renderErrorState()
          ) : !attendance || attendance.length === 0 ? (
            renderEmptyState()
          ) : (
            <ScrollArea className="h-[calc(100vh-500px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Time Out</TableHead>
                    <TableHead className="text-center">
                      Regular Holiday
                    </TableHead>
                    <TableHead className="text-center">
                      Special Holiday
                    </TableHead>
                    <TableHead className="text-center">Undertime</TableHead>
                    <TableHead className="text-center">Overtime</TableHead>
                    <TableHead className="text-center">OT Hours</TableHead>
                    <TableHead className="text-center">Cutoff</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {getEmployeeName(record.employeeId)}
                      </TableCell>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell className="font-mono">
                        {formatTime(record.timeIn)}
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatTime(record.timeOut)}
                      </TableCell>
                      <TableCell className="text-center">
                        {record.regularHoliday ? "✓" : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {record.specialNonWorkingHoliday ? "✓" : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {record.undertime ? "✓" : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {record.overtime ? "✓" : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {record.overtimeHours || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {record.cutoff.toUpperCase()}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <span className="sr-only">Actions</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  attendance: record,
                                  employeeName: getEmployeeName(
                                    record.employeeId
                                  ),
                                })
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                              Delete record
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/home/attendance/${record.id}/edit`}>
                                <SquarePen className="w-4 h-4 mr-2 text-amber-500" />
                                Edit record
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Delete Attendance Dialog */}
      {deleteDialog.attendance && (
        <DeleteAttendanceForm
          open={deleteDialog.open}
          onOpenChange={(open) =>
            setDeleteDialog((prev) => ({ ...prev, open }))
          }
          attendance={deleteDialog.attendance}
          employeeName={deleteDialog.employeeName}
        />
      )}
    </>
  );
}

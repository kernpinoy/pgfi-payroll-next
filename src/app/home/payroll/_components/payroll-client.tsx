"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetEmployeeDeduction from "@/data/use-get-employee-deduction";
import useGetEmployeesFullName from "@/data/use-get-employees-fullname";
import {
  AlertCircle,
  FileX,
  Filter,
  Library,
  RefreshCw,
  Download,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import PayslipPDF from "@/components/payslip-pdf";

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

export default function PayrollClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data } = useGetEmployeesFullName();

  const currentEmployeeId = searchParams.get("employeeId")
    ? decodeURIComponent(searchParams.get("employeeId")!)
    : "";

  const currentMonth = searchParams.get("month")
    ? decodeURIComponent(searchParams.get("month")!)
    : "";

  const currentYear = searchParams.get("year")
    ? decodeURIComponent(searchParams.get("year")!)
    : "";

  const currentCutoff = searchParams.get("cutoff")
    ? decodeURIComponent(searchParams.get("cutoff")!)
    : "";

  function setFilterEmployee(employeeId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (employeeId === "all") {
      params.delete("employeeId");
    } else {
      params.set("employeeId", encodeURIComponent(employeeId));
    }
    router.push(`/home/payroll?${params.toString()}`);
  }

  function setFilterMonth(month: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (month === "all") {
      params.delete("month");
    } else {
      params.set("month", encodeURIComponent(month));
    }
    router.push(`/home/payroll?${params.toString()}`);
  }

  function setFilterYear(year: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (year === "all") {
      params.delete("year");
    } else {
      params.set("year", encodeURIComponent(year));
    }
    router.push(`/home/payroll?${params.toString()}`);
  }

  function setFilterCutoff(cutoff: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cutoff === "all") {
      params.delete("cutoff");
    } else {
      params.set("cutoff", encodeURIComponent(cutoff));
    }
    router.push(`/home/payroll?${params.toString()}`);
  }

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
        <span>Failed to load payroll records. Please try again.</span>
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
      <h3 className="text-lg font-semibold mb-2">No payroll records found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {(currentEmployeeId && currentEmployeeId !== "all") ||
        (currentMonth && currentMonth !== "all") ||
        (currentYear && currentYear !== "all") ||
        (currentCutoff && currentCutoff !== "all")
          ? "No records match your current filters. Try adjusting the filters above."
          : "There are no payroll records in the system yet."}
      </p>
      {((currentEmployeeId && currentEmployeeId !== "all") ||
        (currentMonth && currentMonth !== "all") ||
        (currentYear && currentYear !== "all") ||
        (currentCutoff && currentCutoff !== "all")) && (
        <Button
          variant="outline"
          onClick={() => {
            router.push("/home/payroll");
          }}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  const {
    data: deductions,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useGetEmployeeDeduction({
    employeeId: currentEmployeeId,
    month: currentMonth && currentMonth !== "all" ? currentMonth : undefined,
    year: currentYear && currentYear !== "all" ? currentYear : undefined,
    cutoff:
      currentCutoff && currentCutoff !== "all"
        ? (currentCutoff as "a" | "b")
        : undefined,
  });

  // Function to get the displayed period
  const getDisplayedPeriod = () => {
    const monthDisplay =
      currentMonth && currentMonth !== "all" ? currentMonth : "All Months";
    const yearDisplay =
      currentYear && currentYear !== "all" ? currentYear : "All Years";

    if (monthDisplay === "All Months" && yearDisplay === "All Years") {
      return "All Periods";
    } else if (monthDisplay === "All Months") {
      return yearDisplay;
    } else if (yearDisplay === "All Years") {
      return monthDisplay;
    } else {
      return `${monthDisplay} ${yearDisplay}`;
    }
  };

  // Function to generate and download PDF
  const generatePayslipPDF = async (cutoff: "a" | "b") => {
    if (!deductions) {
      console.error("No deductions data available");
      return;
    }

    const cutoffData = cutoff === "a" ? deductions.cutoffA : deductions.cutoffB;

    try {
      const doc = (
        <PayslipPDF
          data={{
            ...deductions,
            fullName: deductions.employee.fullName,
            workRate: deductions.employee.workRate || 0,
          }}
          cutoff={cutoff}
          month={currentMonth !== "all" ? currentMonth : undefined}
          year={currentYear !== "all" ? currentYear : undefined}
          deductions={cutoffData.deductionsList}
          overtimePay={cutoffData.overtimePay || 0}
          regularHours={cutoffData.regularHours || 0}
          regularHolidayPay={cutoffData.regularHolidayPay || 0}
          specialHolidayPay={cutoffData.specialHolidayPay || 0}
          regularPay={cutoffData.regularPay || 0}
        />
      );

      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();

      const filename = `payslip-${deductions.employee.fullName.replace(
        /\s+/g,
        "-"
      )}-cutoff-${cutoff.toUpperCase()}-${currentMonth || "all"}-${
        currentYear || "all"
      }.pdf`;
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // You might want to show a toast notification here
    }
  };

  return (
    <>
      <div className="space-y-6 p-6">
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
                      <SelectGroup>
                        <SelectItem value="all">All Years</SelectItem>
                        {yearOptions}
                      </SelectGroup>
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              {/** Cutoff filter select */}
              <div className="space-y-2">
                <Label htmlFor="filterCutoff">Cutoff</Label>
                <Select value={currentCutoff} onValueChange={setFilterCutoff}>
                  <SelectTrigger id="filterCutoff">
                    <SelectValue placeholder="Select cutoff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cutoffs</SelectItem>
                    <SelectItem value="a">Cutoff A</SelectItem>
                    <SelectItem value="b">Cutoff B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/** add refresh button */}
              <div className="space-y-2">
                <Label className="invisible">Actions</Label>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Records
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Library className="w-5 h-5 mr-2" />
              Payroll Records - {getDisplayedPeriod()}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading || isFetching ? (
              renderLoadingState()
            ) : isError || error ? (
              renderErrorState()
            ) : !deductions ? (
              renderEmptyState()
            ) : (
              <ScrollArea className="h-[calc(100vh-500px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cutoff Period</TableHead>
                      <TableHead>Hours Worked</TableHead>
                      <TableHead>Overtime Hours</TableHead>
                      <TableHead>Regular Holidays</TableHead>
                      <TableHead>Special Holidays</TableHead>
                      <TableHead>Gross Pay</TableHead>
                      <TableHead>Total Deductions</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Render cutoff a */}
                    {(!currentCutoff ||
                      currentCutoff === "all" ||
                      currentCutoff === "a") && (
                      <TableRow>
                        <TableCell className="font-medium">A</TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffA.hoursWorked}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffA.overtime}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffA.regularHolidays}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffA.specialHolidays}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffA.grossPay.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PHP",
                          })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffA.totalDeduction.toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "PHP",
                            }
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffA.netPay.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PHP",
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generatePayslipPDF("a")}
                            className="flex items-center"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                    {/* Render cutoff b */}
                    {(!currentCutoff ||
                      currentCutoff === "all" ||
                      currentCutoff === "b") && (
                      <TableRow>
                        <TableCell className="font-medium">B</TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffB.hoursWorked}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffB.overtime}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffB.regularHolidays}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffB.specialHolidays}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffB.grossPay.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PHP",
                          })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffB.totalDeduction.toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "PHP",
                            }
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {deductions.cutoffB.netPay.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PHP",
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generatePayslipPDF("b")}
                            className="flex items-center"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

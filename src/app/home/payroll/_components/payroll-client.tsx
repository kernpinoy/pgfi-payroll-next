"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetEmployeeDeduction from "@/data/use-get-employee-deduction";
import useGetEmployeesFullName from "@/data/use-get-employees-fullname";
import { Library } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import PayslipPDF from "@/components/payslip-pdf";
import { useCallback, useMemo } from "react";

// Import our new components and hooks
import { usePayrollFilters } from "@/hooks/use-payroll-filters";
import PayrollFiltersCard from "./payroll-filters-card";
import PayrollTable from "./payroll-table";
import {
  PayrollLoadingState,
  PayrollErrorState,
  PayrollSelectFiltersState,
  PayrollEmptyState,
} from "./payroll-states";
import { toast } from "sonner";

export default function PayrollClient() {
  const { data: employees } = useGetEmployeesFullName();

  // Use our custom hook for filter management
  const {
    filters,
    hasRequiredFilters,
    setEmployee,
    setMonth,
    setYear,
    setCutoff,
    clearFilters,
    getDisplayedPeriod,
  } = usePayrollFilters();

  // Memoize query parameters to prevent unnecessary refetches
  const queryParams = useMemo(
    () => ({
      employeeId: hasRequiredFilters ? filters.employeeId : "",
      month: hasRequiredFilters ? filters.month : undefined,
      year: hasRequiredFilters ? filters.year : undefined,
      cutoff:
        filters.cutoff && filters.cutoff !== "all"
          ? (filters.cutoff as "a" | "b")
          : undefined,
    }),
    [
      hasRequiredFilters,
      filters.employeeId,
      filters.month,
      filters.year,
      filters.cutoff,
    ]
  );

  // Get payroll data
  const {
    data: deductions,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useGetEmployeeDeduction(queryParams);

  // Memoized PDF generation function (keeping this here due to JSX requirements)
  const generatePayslipPDF = useCallback(
    async (cutoff: "a" | "b") => {
      if (!deductions || !hasRequiredFilters) {
        toast.error(
          "No deductions data available or required filters not selected."
        );
        return;
      }
      
      try {
        const doc = (
          <PayslipPDF
            data={deductions}
            cutoff={cutoff}
            month={filters.month}
            year={filters.year}
          />
        );

        const asPdf = pdf(doc);
        const blob = await asPdf.toBlob();

        const filename = `payslip-${deductions.employee!.fullName.replace(
          /\s+/g,
          "-"
        )}-cutoff-${cutoff.toUpperCase()}-${filters.month}-${filters.year}.pdf`;
        saveAs(blob, filename);
      } catch (error) {
        toast.error("Error generating PDF. Please try again.");
      }
    },
    [deductions, hasRequiredFilters, filters.month, filters.year]
  );

  // Memoize the displayed period to prevent unnecessary recalculations
  const displayedPeriod = useMemo(
    () => getDisplayedPeriod(),
    [getDisplayedPeriod]
  );

  // Memoize content rendering to prevent unnecessary re-renders
  const renderContent = useMemo(() => {
    if (!hasRequiredFilters) {
      return <PayrollSelectFiltersState />;
    }
    if (isLoading || isFetching) {
      return <PayrollLoadingState />;
    }
    if (isError || error) {
      return <PayrollErrorState onRetry={refetch} />;
    }
    if (!deductions) {
      return <PayrollEmptyState onClearFilters={clearFilters} />;
    }
    return (
      <PayrollTable
        deductions={deductions}
        currentCutoff={filters.cutoff}
        onGeneratePDF={generatePayslipPDF}
      />
    );
  }, [
    hasRequiredFilters,
    isLoading,
    isFetching,
    isError,
    error,
    deductions,
    filters.cutoff,
    refetch,
    clearFilters,
    generatePayslipPDF,
  ]);

  return (
    <div className="space-y-6 p-6">
      {/* Filters Card */}
      <PayrollFiltersCard
        filters={filters}
        hasRequiredFilters={hasRequiredFilters}
        employees={employees}
        onEmployeeChange={setEmployee}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onCutoffChange={setCutoff}
        onSearch={refetch}
        onClear={clearFilters}
      />

      {/* Results Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Library className="w-5 h-5 mr-2" />
            Payroll Records - {displayedPeriod}
          </CardTitle>
        </CardHeader>

        <CardContent>{renderContent}</CardContent>
      </Card>
    </div>
  );
}

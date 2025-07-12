import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useCallback } from "react";

export interface PayrollFilters {
  employeeId: string;
  month: string; // Human-readable month name like "May"
  year: string;
  cutoff: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Converts "May" to "5"
function monthNameToNumber(monthName: string): string {
  const index = MONTHS.findIndex((m) => m.toLowerCase() === monthName.toLowerCase());
  return index >= 0 ? String(index + 1) : "";
}

export function usePayrollFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: PayrollFilters = useMemo(() => {
    return {
      employeeId: searchParams.get("employeeId")
        ? decodeURIComponent(searchParams.get("employeeId")!)
        : "",
      month: searchParams.get("month")
        ? decodeURIComponent(searchParams.get("month")!)
        : "",
      year: searchParams.get("year")
        ? decodeURIComponent(searchParams.get("year")!)
        : "",
      cutoff: searchParams.get("cutoff")
        ? decodeURIComponent(searchParams.get("cutoff")!)
        : "",
    };
  }, [searchParams]);

  const hasRequiredFilters = useMemo(() => {
    const monthInt = parseInt(monthNameToNumber(filters.month), 10);
    const yearInt = parseInt(filters.year, 10);

    return Boolean(
      filters.employeeId &&
      !isNaN(monthInt) &&
      monthInt >= 1 &&
      monthInt <= 12 &&
      !isNaN(yearInt) &&
      yearInt >= 1900
    );
  }, [filters.employeeId, filters.month, filters.year]);

  const updateFilter = useCallback(
    (key: keyof PayrollFilters, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, encodeURIComponent(value));
      }
      router.push(`/home/payroll?${params.toString()}`);
    },
    [searchParams, router]
  );

  const setEmployee = useCallback(
    (employeeId: string) => updateFilter("employeeId", employeeId),
    [updateFilter]
  );
  const setMonth = useCallback(
    (month: string) => updateFilter("month", month),
    [updateFilter]
  );
  const setYear = useCallback(
    (year: string) => updateFilter("year", year),
    [updateFilter]
  );
  const setCutoff = useCallback(
    (cutoff: string) => updateFilter("cutoff", cutoff),
    [updateFilter]
  );

  const clearFilters = useCallback(() => {
    router.push("/home/payroll");
  }, [router]);

  const getDisplayedPeriod = useCallback(() => {
    if (!hasRequiredFilters) {
      return "Select Employee, Month & Year";
    }
    return `${filters.month} ${filters.year}`;
  }, [hasRequiredFilters, filters.month, filters.year]);

  return {
    filters,
    hasRequiredFilters,
    setEmployee,
    setMonth,
    setYear,
    setCutoff,
    clearFilters,
    getDisplayedPeriod,
  };
}

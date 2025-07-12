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
import { Filter, RefreshCw } from "lucide-react";
import { useMemo, memo } from "react";
import { PayrollFilters } from "@/hooks/use-payroll-filters";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface PayrollFiltersCardProps {
  filters: PayrollFilters;
  hasRequiredFilters: boolean;
  employees: Array<{ id: string; fullName: string }> | undefined;
  onEmployeeChange: (employeeId: string) => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  onCutoffChange: (cutoff: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

// Memoized year options component
const YearOptions = memo(() => {
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

  return <>{yearOptions}</>;
});

YearOptions.displayName = "YearOptions";

// Memoized month options component
const MonthOptions = memo(() => (
  <>
    {MONTHS.map((month, index) => (
      <SelectItem key={index} value={month}>
        {month}
      </SelectItem>
    ))}
  </>
));

MonthOptions.displayName = "MonthOptions";

// Memoized employee options component  
const EmployeeOptions = memo(({ employees }: { employees: Array<{ id: string; fullName: string }> | undefined }) => (
  <>
    {employees?.map((employee) => (
      <SelectItem key={employee.id} value={employee.id}>
        {employee.fullName}
      </SelectItem>
    ))}
  </>
));

EmployeeOptions.displayName = "EmployeeOptions";

function PayrollFiltersCard({
  filters,
  hasRequiredFilters,
  employees,
  onEmployeeChange,
  onMonthChange,
  onYearChange,
  onCutoffChange,
  onSearch,
  onClear,
}: PayrollFiltersCardProps) {
  // Memoize validation classes to prevent recalculation
  const employeeClassName = useMemo(() => 
    !filters.employeeId || filters.employeeId === "all" ? "border-red-300" : "",
    [filters.employeeId]
  );

  const monthClassName = useMemo(() => 
    !filters.month || filters.month === "all" ? "border-red-300" : "",
    [filters.month]
  );

  const yearClassName = useMemo(() => 
    !filters.year || filters.year === "all" ? "border-red-300" : "",
    [filters.year]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Payroll Search Filters
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select an employee, month, and year to search for payroll records. Click "Search" to load the data.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-3">
          {/* Employee filter select - REQUIRED */}
          <div className="space-y-2">
            <Label htmlFor="filterEmployee" className="flex items-center">
              Employee <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select value={filters.employeeId} onValueChange={onEmployeeChange}>
              <SelectTrigger id="filterEmployee" className={employeeClassName}>
                <SelectValue placeholder="Select employee (required)" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="max-h-[250px]">
                  <EmployeeOptions employees={employees} />
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Month filter select - REQUIRED */}
          <div className="space-y-2">
            <Label htmlFor="filterMonth" className="flex items-center">
              Month <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select value={filters.month} onValueChange={onMonthChange}>
              <SelectTrigger id="filterMonth" className={monthClassName}>
                <SelectValue placeholder="Select month (required)" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  <MonthOptions />
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Year filter select - REQUIRED */}
          <div className="space-y-2">
            <Label htmlFor="filterYear" className="flex items-center">
              Year <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select value={filters.year} onValueChange={onYearChange}>
              <SelectTrigger id="filterYear" className={yearClassName}>
                <SelectValue placeholder="Select year (required)" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  <SelectGroup>
                    <YearOptions />
                  </SelectGroup>
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Cutoff filter select - OPTIONAL */}
          <div className="space-y-2">
            <Label htmlFor="filterCutoff">Cutoff (Optional)</Label>
            <Select value={filters.cutoff} onValueChange={onCutoffChange}>
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

          {/* Search and clear buttons */}
          <div className="space-y-2">
            <Label className="invisible">Actions</Label>
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={onSearch}
                disabled={!hasRequiredFilters}
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={onClear}
                className="flex items-center"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(PayrollFiltersCard);

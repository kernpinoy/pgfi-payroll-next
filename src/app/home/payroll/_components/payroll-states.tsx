import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileX, Filter, RefreshCw } from "lucide-react";
import { memo } from "react";

interface PayrollStatesProps {
  onRetry: () => void;
  onClearFilters: () => void;
}

// Memoized loading skeletons
const LoadingSkeleton = memo(() => (
  <div className="flex space-x-4">
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
));

LoadingSkeleton.displayName = "LoadingSkeleton";

export const PayrollLoadingState = memo(() => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <LoadingSkeleton key={i} />
    ))}
  </div>
));

PayrollLoadingState.displayName = "PayrollLoadingState";

export const PayrollErrorState = memo(({ onRetry }: Pick<PayrollStatesProps, 'onRetry'>) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription className="flex items-center justify-between">
      <span>Failed to load payroll records. Please try again.</span>
      <Button variant="outline" size="sm" onClick={onRetry} className="ml-2">
        <RefreshCw className="h-3 w-3 mr-1" />
        Retry
      </Button>
    </AlertDescription>
  </Alert>
));

PayrollErrorState.displayName = "PayrollErrorState";

export const PayrollSelectFiltersState = memo(() => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Filter className="h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold mb-2">Select Required Filters</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Please select an employee, month, and year above to view payroll records.
    </p>
    <div className="text-xs text-muted-foreground">
      <p>Required fields are marked with a red asterisk (*)</p>
    </div>
  </div>
));

PayrollSelectFiltersState.displayName = "PayrollSelectFiltersState";

export const PayrollEmptyState = memo(({ onClearFilters }: Pick<PayrollStatesProps, 'onClearFilters'>) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <FileX className="h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold mb-2">No payroll records found</h3>
    <p className="text-sm text-muted-foreground mb-4">
      No records found for the selected employee, month, and year combination.
    </p>
    <Button variant="outline" onClick={onClearFilters}>
      Clear Filters
    </Button>
  </div>
));

PayrollEmptyState.displayName = "PayrollEmptyState";

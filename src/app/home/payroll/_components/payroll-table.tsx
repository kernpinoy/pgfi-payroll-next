import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type GetDeductionsPerEmployee } from "@/db/functions/employee";
import { Download } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

interface PayrollTableProps {
  deductions: GetDeductionsPerEmployee; // You might want to create a proper type for this
  currentCutoff: string;
  onGeneratePDF: (cutoff: "a" | "b") => void;
}

// Memoized currency formatter
const formatCurrency = (amount: number) =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "PHP",
  });

// Memoized table row component
const CutoffRow = memo(
  ({
    cutoff,
    cutoffData,
    onGeneratePDF,
  }: {
    cutoff: "a" | "b";
    cutoffData: GetDeductionsPerEmployee["cutoffA"] | GetDeductionsPerEmployee["cutoffB"];
    onGeneratePDF: (cutoff: "a" | "b") => void;
  }) => {
    // Memoize PDF generation handler for this specific cutoff
    const handleGeneratePDF = useCallback(() => {
      onGeneratePDF(cutoff);
    }, [cutoff, onGeneratePDF]);

    // Memoize formatted values to prevent recalculation
    const formattedValues = useMemo(() => ({
      grossPay: formatCurrency(cutoffData.grossPay),
      totalDeduction: cutoffData.grossPay === 0 ? formatCurrency(0) : formatCurrency(cutoffData.totalDeduction),
      netPay: cutoffData.grossPay === 0 ? formatCurrency(0) : formatCurrency(cutoffData.netPay),
    }), [cutoffData.grossPay, cutoffData.totalDeduction, cutoffData.netPay]);

    return (
      <TableRow>
        <TableCell className="font-medium">{cutoff.toUpperCase()}</TableCell>
        <TableCell className="font-medium">{cutoffData.hoursWorked}</TableCell>
        <TableCell className="font-medium">{cutoffData.overtimeHours}</TableCell>
        <TableCell className="font-medium">
          {cutoffData.regularHolidayDays}
        </TableCell>
        <TableCell className="font-medium">
          {cutoffData.specialHolidayDays}
        </TableCell>
        <TableCell className="font-medium">{formattedValues.grossPay}</TableCell>
      <TableCell className="font-medium">{formattedValues.totalDeduction}</TableCell>
      <TableCell className="font-medium">{formattedValues.netPay}</TableCell>
        <TableCell>
          <Button
            disabled={!cutoffData.grossPay}
            variant="outline"
            size="sm"
            onClick={handleGeneratePDF}
            className="flex items-center"
          >
            <Download className="h-3 w-3 mr-1" />
            PDF
          </Button>
        </TableCell>
      </TableRow>
    );
  }
);

CutoffRow.displayName = "CutoffRow";

function PayrollTable({
  deductions,
  currentCutoff,
  onGeneratePDF,
}: PayrollTableProps) {
  // Memoize visibility calculations
  const shouldShowCutoffA = useMemo(
    () => !currentCutoff || currentCutoff === "all" || currentCutoff === "a",
    [currentCutoff]
  );

  const shouldShowCutoffB = useMemo(
    () => !currentCutoff || currentCutoff === "all" || currentCutoff === "b",
    [currentCutoff]
  );

  return (
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
          {shouldShowCutoffA && (
            <CutoffRow
              cutoff="a"
              cutoffData={deductions.cutoffA}
              onGeneratePDF={onGeneratePDF}
            />
          )}
          {shouldShowCutoffB && (
            <CutoffRow
              cutoff="b"
              cutoffData={deductions.cutoffB}
              onGeneratePDF={onGeneratePDF}
            />
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

// Export memoized component
export default memo(PayrollTable);

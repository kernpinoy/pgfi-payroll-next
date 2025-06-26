"use client";

import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "./scroll-area";

interface DatePickerProps {
  startYear?: number;
  endYear?: number;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Months array
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

// Pre-generate years array for common range to avoid recalculation
const DEFAULT_YEARS = (() => {
  const result = [];
  for (let year = new Date().getFullYear(); year >= 1900; year--) {
    result.push(year);
  }
  return result;
})();

export function DatePicker({
  startYear = 1900,
  endYear = new Date().getFullYear(),
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>(value || new Date());
  const [open, setOpen] = React.useState(false);

  // Use pre-generated years array if possible, otherwise create custom one
  const years = React.useMemo(() => {
    if (startYear === 1900 && endYear === new Date().getFullYear()) {
      return DEFAULT_YEARS; // Use pre-generated array for common case
    }

    const result = [];
    for (let year = endYear; year >= startYear; year--) {
      result.push(year);
    }
    return result;
  }, [startYear, endYear]);

  // Update internal state when external value changes
  React.useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  // Event handlers
  const handleMonthChange = React.useCallback(
    (month: string) => {
      const newDate = setMonth(date, MONTHS.indexOf(month));
      setDate(newDate);
      onChange?.(newDate);
    },
    [date, onChange],
  );

  const handleYearChange = React.useCallback(
    (year: string) => {
      const newDate = setYear(date, Number.parseInt(year));
      setDate(newDate);
      onChange?.(newDate);
    },
    [date, onChange],
  );

  const handleSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      if (selectedDate) {
        setDate(selectedDate);
        onChange?.(selectedDate);
        setOpen(false);
      }
    },
    [onChange],
  );

  // Current values - memoized to avoid recalculation
  const currentMonth = React.useMemo(() => MONTHS[getMonth(date)], [date]);
  const currentYear = React.useMemo(() => getYear(date).toString(), [date]);

  // Pre-format the date to avoid formatting on every render
  const formattedDate = React.useMemo(
    () => (date ? format(date, "PPP") : ""),
    [date],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate ? formattedDate : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        side="bottom"
        align="start"
        avoidCollisions={true}
        collisionPadding={10}
      >
        <div className="flex justify-between p-2">
          {/* Month Select */}
          <Select
            onValueChange={handleMonthChange}
            value={currentMonth}
            defaultOpen={false}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleYearChange}
            value={currentYear}
            defaultOpen={false}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          month={date}
          onMonthChange={setDate}
        />
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import Fuse from "fuse.js";

interface EmployeeComboboxProps {
  data: { id: string; fullName: string }[];
  onValueChange: (value: string) => void;
  value?: string;
  labelId?: string;
}

export function EmployeeCombobox({
  data,
  onValueChange,
  value: controlledValue,
  labelId,
}: EmployeeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: ["fullName"],
        threshold: 0.4,
        includeScore: true,
      }),
    [data]
  );

  const filteredData = useMemo(() => {
    if (!search) return data;
    const results = fuse.search(search);
    return results.map((result) => result.item);
  }, [search, data, fuse]);

  const getDisplayValue = useMemo(() => {
    if (controlledValue === "all") return "All Employees";
    const employee = data.find((item) => item.id === controlledValue);
    return employee?.fullName || "Select employees...";
  }, [controlledValue, data]);

  const handleSelect = useCallback(
    (selectedValue: string) => {
      onValueChange(selectedValue);
      setOpen(false);
      setSearch("");
    },
    [onValueChange]
  );

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearch("");
    }
  }, []);

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild id={labelId}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {getDisplayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="flex flex-col">
          <div className="p-2 border-b">
            <Input
              ref={inputRef}
              placeholder="Search employees"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <ScrollArea className="max-h-[200px]">
            <div className="p-1">
              {filteredData.length === 0 && search ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No employee found.
                </div>
              ) : (
                <>
                  <div
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 justify-between"
                    onClick={() => handleSelect("all")}
                  >
                    All Employees
                    <CheckIcon
                      className={cn(
                        "h-4 w-4",
                        controlledValue === "all" ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                  {filteredData.map((employee) => (
                    <div
                      key={employee.id}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 justify-between"
                      onClick={() => handleSelect(employee.id)}
                    >
                      {employee.fullName}
                      <CheckIcon
                        className={cn(
                          "h-4 w-4",
                          controlledValue === employee.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}

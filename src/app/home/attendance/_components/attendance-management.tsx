"use client";

import { useState } from "react";
import {
  Save,
  Calendar,
  User,
  Eye,
  Plus,
  Filter,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface AttendanceRecord {
  id: string;
  employee: string;
  date: string;
  timeIn: string;
  timeOut: string;
  dayType: "regular" | "rh" | "snw" | "";
  timeAdjustment: "ut" | "ot" | "";
  overtimeHours: number;
  status: "present" | "absent" | "partial";
}

export default function Component() {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("entry");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Filters for historical view
  const [filterEmployee, setFilterEmployee] = useState("all");
  const [filterYear, setFilterYear] = useState("2025");
  const [filterMonth, setFilterMonth] = useState("all");

  // Sample historical data
  const [historicalData] = useState<AttendanceRecord[]>([
    {
      id: "1",
      employee: "john-doe",
      date: "2025-05-01",
      timeIn: "09:00",
      timeOut: "17:00",
      dayType: "regular",
      timeAdjustment: "",
      overtimeHours: 0,
      status: "present",
    },
    {
      id: "2",
      employee: "john-doe",
      date: "2025-05-02",
      timeIn: "09:15",
      timeOut: "19:30",
      dayType: "regular",
      timeAdjustment: "ot",
      overtimeHours: 2.25,
      status: "present",
    },
    {
      id: "3",
      employee: "jane-smith",
      date: "2025-05-01",
      timeIn: "08:30",
      timeOut: "16:30",
      dayType: "regular",
      timeAdjustment: "",
      overtimeHours: 0,
      status: "present",
    },
    {
      id: "4",
      employee: "mike-johnson",
      date: "2025-05-01",
      timeIn: "10:00",
      timeOut: "15:00",
      dayType: "regular",
      timeAdjustment: "ut",
      overtimeHours: 0,
      status: "partial",
    },
  ]);

  const [currentEntry, setCurrentEntry] = useState<
    Omit<AttendanceRecord, "id">
  >({
    employee: "",
    date: format(selectedDate, "yyyy-MM-dd"),
    timeIn: "",
    timeOut: "",
    dayType: "",
    timeAdjustment: "",
    overtimeHours: 0,
    status: "absent",
  });

  const updateEntry = (
    field: keyof Omit<AttendanceRecord, "id">,
    value: unknown
  ) => {
    const updated = { ...currentEntry, [field]: value };

    // Auto-update status
    if (updated.timeIn && updated.timeOut) {
      updated.status = "present";
    } else if (updated.timeIn || updated.timeOut) {
      updated.status = "partial";
    } else {
      updated.status = "absent";
    }

    // Clear overtime hours if not overtime
    if (field === "timeAdjustment" && value !== "ot") {
      updated.overtimeHours = 0;
    }

    setCurrentEntry(updated);
    setHasUnsavedChanges(true);
  };

  const selectEmployee = (employee: string) => {
    setSelectedEmployee(employee);
    updateEntry("employee", employee);
  };

  const selectDate = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      updateEntry("date", format(date, "yyyy-MM-dd"));
      setDatePickerOpen(false);
    }
  };

  const quickTimeSet = (timeIn: string, timeOut: string) => {
    updateEntry("timeIn", timeIn);
    updateEntry("timeOut", timeOut);
  };

  const saveEntry = () => {
    setHasUnsavedChanges(false);
    console.log("Saving attendance entry:", currentEntry);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "absent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const names: Record<string, string> = {
      "john-doe": "John Doe",
      "jane-smith": "Jane Smith",
      "mike-johnson": "Mike Johnson",
    };
    return names[employeeId] || employeeId;
  };

  const getDayTypeLabel = (dayType: string) => {
    switch (dayType) {
      case "regular":
        return "Regular Day";
      case "rh":
        return "Regular Holiday";
      case "snw":
        return "Special Non-Working Holiday";
      default:
        return "-";
    }
  };

  const getTimeAdjustmentLabel = (timeAdjustment: string) => {
    switch (timeAdjustment) {
      case "ut":
        return "Undertime";
      case "ot":
        return "Overtime";
      default:
        return "-";
    }
  };

  // Filter historical data
  const filteredData = historicalData.filter((record) => {
    if (filterEmployee !== "all" && record.employee !== filterEmployee)
      return false;
    if (filterYear !== "all" && !record.date.startsWith(filterYear))
      return false;
    if (filterMonth !== "all") {
      const recordMonth = record.date.split("-")[1];
      if (recordMonth !== filterMonth) return false;
    }
    return true;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Attendance Management
          </h1>
          <div className="flex items-center space-x-4">
            {hasUnsavedChanges && (
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-200"
              >
                Unsaved Changes
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="entry" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Entry</span>
            </TabsTrigger>
            <TabsTrigger value="view" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>View Records</span>
            </TabsTrigger>
          </TabsList>

          {/* Entry Tab */}
          <TabsContent value="entry" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Employee & Date Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Employee & Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="employee">Employee</Label>
                    <Select
                      value={selectedEmployee}
                      onValueChange={selectEmployee}
                    >
                      <SelectTrigger id="employee">
                        <SelectValue placeholder="Select employee..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john-doe">John Doe</SelectItem>
                        <SelectItem value="jane-smith">Jane Smith</SelectItem>
                        <SelectItem value="mike-johnson">
                          Mike Johnson
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover
                      open={datePickerOpen}
                      onOpenChange={setDatePickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={selectDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {selectedEmployee && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-center">
                        <Badge className={getStatusColor(currentEntry.status)}>
                          {currentEntry.status.toUpperCase()}
                        </Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Time Entry */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Time Entry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="timeIn">Time In</Label>
                    <Input
                      id="timeIn"
                      type="time"
                      value={currentEntry.timeIn}
                      onChange={(e) => updateEntry("timeIn", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeOut">Time Out</Label>
                    <Input
                      id="timeOut"
                      type="time"
                      value={currentEntry.timeOut}
                      onChange={(e) => updateEntry("timeOut", e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Quick Times</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickTimeSet("09:00", "17:00")}
                      >
                        9 AM - 5 PM
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickTimeSet("08:00", "16:00")}
                      >
                        8 AM - 4 PM
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Day Type */}
                  <div className="space-y-3">
                    <Label>Day Type</Label>
                    <RadioGroup
                      value={currentEntry.dayType}
                      onValueChange={(value) => updateEntry("dayType", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="regular" id="regular" />
                        <Label htmlFor="regular" className="font-normal">
                          Regular Day
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rh" id="rh" />
                        <Label htmlFor="rh" className="font-normal">
                          Regular Holiday
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="snw" id="snw" />
                        <Label htmlFor="snw" className="font-normal">
                          Special Non-Working Holiday
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* Time Adjustments */}
                  <div className="space-y-3">
                    <Label>Time Adjustments</Label>
                    <RadioGroup
                      value={currentEntry.timeAdjustment}
                      onValueChange={(value) =>
                        updateEntry("timeAdjustment", value)
                      }
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ut" id="ut" />
                        <Label htmlFor="ut" className="font-normal">
                          Undertime
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ot" id="ot" />
                        <Label htmlFor="ot" className="font-normal">
                          Overtime
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="overtimeHours">
                      Overtime Hours
                      {currentEntry.timeAdjustment !== "ot" && (
                        <span className="text-muted-foreground text-xs ml-1">
                          (Overtime must be selected)
                        </span>
                      )}
                    </Label>
                    <Input
                      id="overtimeHours"
                      type="number"
                      step="0.25"
                      min="0"
                      value={
                        currentEntry.timeAdjustment === "ot"
                          ? currentEntry.overtimeHours || ""
                          : ""
                      }
                      onChange={(e) =>
                        updateEntry(
                          "overtimeHours",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0.00"
                      disabled={currentEntry.timeAdjustment !== "ot"}
                    />
                  </div>

                  <Separator />

                  <Button
                    onClick={saveEntry}
                    disabled={!hasUnsavedChanges || !selectedEmployee}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* View Tab */}
          <TabsContent value="view" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="filterEmployee">Employee</Label>
                    <Select
                      value={filterEmployee}
                      onValueChange={setFilterEmployee}
                    >
                      <SelectTrigger id="filterEmployee">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        <SelectItem value="john-doe">John Doe</SelectItem>
                        <SelectItem value="jane-smith">Jane Smith</SelectItem>
                        <SelectItem value="mike-johnson">
                          Mike Johnson
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filterYear">Year</Label>
                    <Select value={filterYear} onValueChange={setFilterYear}>
                      <SelectTrigger id="filterYear">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filterMonth">Month</Label>
                    <Select value={filterMonth} onValueChange={setFilterMonth}>
                      <SelectTrigger id="filterMonth">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Months</SelectItem>
                        <SelectItem value="01">January</SelectItem>
                        <SelectItem value="02">February</SelectItem>
                        <SelectItem value="03">March</SelectItem>
                        <SelectItem value="04">April</SelectItem>
                        <SelectItem value="05">May</SelectItem>
                        <SelectItem value="06">June</SelectItem>
                        <SelectItem value="07">July</SelectItem>
                        <SelectItem value="08">August</SelectItem>
                        <SelectItem value="09">September</SelectItem>
                        <SelectItem value="10">October</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">December</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Badge variant="outline" className="h-fit">
                      {filteredData.length} records
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historical Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time In</TableHead>
                        <TableHead>Time Out</TableHead>
                        <TableHead>Day Type</TableHead>
                        <TableHead>Time Adjustment</TableHead>
                        <TableHead>OT Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {getEmployeeName(record.employee)}
                          </TableCell>
                          <TableCell>{formatDate(record.date)}</TableCell>
                          <TableCell className="font-mono">
                            {record.timeIn || "-"}
                          </TableCell>
                          <TableCell className="font-mono">
                            {record.timeOut || "-"}
                          </TableCell>
                          <TableCell>
                            {getDayTypeLabel(record.dayType)}
                          </TableCell>
                          <TableCell>
                            {getTimeAdjustmentLabel(record.timeAdjustment)}
                          </TableCell>
                          <TableCell>{record.overtimeHours || 0}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/animated-tabs";
import { Eye, Plus } from "lucide-react";
import AddAttendanceForm from "./add-attendance-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ViewEmployeeAttendance } from "./view-employee-attendance";

const VALID_TABS = ["add-attendance", "view-attendance"];
const TAB_SPECIFIC_PARAMS = {
  "view-attendance": ["employeeId", "month"],
};

// Helper functions for safe URL encoding/decoding
function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    console.warn("Failed to decode URI component:", str, e);
    return str;
  }
}

function safeEncodeURIComponent(str: string): string {
  try {
    return encodeURIComponent(str);
  } catch (e) {
    console.warn("Failed to encode URI component:", str, e);
    return str;
  }
}

export default function AttendanceClient() {
  // const { data } = useGetEmployeeDetails();
  const router = useRouter();
  const searchParams = useSearchParams();

  // tab from query params, default to "add-attendance" - decode safely
  const rawTab = searchParams.get("tab");
  const tab = rawTab ? safeDecodeURIComponent(rawTab) : "add-attendance";

  // update query param on tab change
  function handleTabChange(value: string) {
    const params = new URLSearchParams();

    // Safely decode and re-encode existing params
    for (const [key, paramValue] of searchParams.entries()) {
      const decodedKey = safeDecodeURIComponent(key);
      const decodedValue = safeDecodeURIComponent(paramValue);
      params.set(
        safeEncodeURIComponent(decodedKey),
        safeEncodeURIComponent(decodedValue)
      );
    }

    // get all params for the current tab, remove
    const currentTabParams =
      TAB_SPECIFIC_PARAMS[tab as keyof typeof TAB_SPECIFIC_PARAMS] || [];
    currentTabParams.forEach((param) => {
      params.delete(safeEncodeURIComponent(param));
    });

    // set the new tab (encode the value)
    params.set("tab", safeEncodeURIComponent(value));

    // Navigate with encoded URL
    router.replace(`/home/attendance?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    if (!VALID_TABS.includes(tab)) {
      const params = new URLSearchParams();

      // Safely decode and re-encode existing params
      for (const [key, paramValue] of searchParams.entries()) {
        const decodedKey = safeDecodeURIComponent(key);
        const decodedValue = safeDecodeURIComponent(paramValue);
        params.set(
          safeEncodeURIComponent(decodedKey),
          safeEncodeURIComponent(decodedValue)
        );
      }

      params.set("tab", safeEncodeURIComponent("add-attendance"));
      router.push(`?${params.toString()}`, { scroll: false });
    }
    // only run when tab or searchParams change
  }, [tab, searchParams, router]);

  return (
    <div className="p-6">
      <Tabs
        value={tab}
        onValueChange={handleTabChange}
        className="space-y-6 transition-colors"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger
            value="add-attendance"
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </TabsTrigger>
          <TabsTrigger
            value="view-attendance"
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View Records</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-attendance">
          <AddAttendanceForm />
        </TabsContent>
        <TabsContent value="view-attendance" className="space-y-6">
          <ViewEmployeeAttendance />
        </TabsContent>
      </Tabs>
    </div>
  );
}

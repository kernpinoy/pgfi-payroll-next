"use client";

import { useParams } from "next/navigation";
import EditAttendanceClient from "./_components/edit-attendance-client";

export default function EditAttendancePage() {
  const { id } = useParams();

  if (!id || typeof id !== "string") {
    return <div>Invalid attendance ID</div>;
  }

  return (
    <div className="p-6">
      <EditAttendanceClient attendanceId={id} />
    </div>
  );
}

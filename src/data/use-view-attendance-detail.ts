import { useQuery } from "@tanstack/react-query";
import { getAttendanceById } from "@/db/functions/employee";

export default function useViewAttendanceDetail(attendanceId: string) {
  return useQuery({
    queryKey: ["attendance-detail", attendanceId],
    queryFn: async () => getAttendanceById(attendanceId),
    enabled: !!attendanceId,
  });
}

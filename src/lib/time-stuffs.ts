import { parse, differenceInMinutes } from "date-fns";

export function computeHoursWorked(
  timeIn: string,
  timeOut: string,
  lunchbreak: number = 60,
) {
  const baseDate = new Date();
  const parsedTimeIn = parse(timeIn, "HH:mm", baseDate);
  const parsedTimeOut = parse(timeOut, "HH:mm", baseDate);
  const totalMinutes = differenceInMinutes(parsedTimeOut, parsedTimeIn);

  const netMinutes = totalMinutes - lunchbreak;

  return netMinutes / 60;
}

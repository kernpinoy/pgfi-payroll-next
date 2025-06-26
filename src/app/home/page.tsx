import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlusIcon,
  CalendarIcon,
  HandCoinsIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { getEmployeeCount } from "@/db/functions/employee";

export default async function Home() {
  const { session, user } = await validateRequest();

  if (!session || !user) redirect("/");

  const employeeCount = await getEmployeeCount();

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your payroll today.
        </p>
      </div>


      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button asChild className="h-16 flex-col gap-2">
            <Link href="/home/employees">
              <UserPlusIcon className="h-6 w-6" />
              Manage Employees
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-16 flex-col gap-2">
            <Link href="/home/attendance">
              <CalendarIcon className="h-6 w-6" />
              Record Attendance
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-16 flex-col gap-2">
            <Link href="/home/payroll">
              <HandCoinsIcon className="h-6 w-6" />
              Process Payroll
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-1 max-w-sm">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Employees</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeCount}</div>
            <p className="text-xs text-muted-foreground">Total employees</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useViewEmployeeDetail from "@/data/use-view-employee-detail";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, RefreshCw, UserPen } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Import the Loading component
import Loading from "../loading";

export default function ViewEmployeeDetails({
  employeeId,
}: {
  employeeId: string;
}) {
  const {
    data: employeeDetails,
    isLoading,
    isError,
  } = useViewEmployeeDetail(employeeId);
  const router = useRouter();

  // Early return for loading state
  if (isLoading) {
    return <Loading />;
  }

  // Early return for error state
  if (isError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Error loading employee data
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn&apos;t load the employee information. Please try
                again.
              </p>
              <Button
                onClick={() => router.refresh()}
                className="flex items-center gap-2"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" /> Refresh page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-row justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1 hover:cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Go back
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 hover:cursor-pointer"
          asChild
        >
          <Link href={`/home/employees/${employeeId}/edit`}>
            <UserPen className="h-4 w-4" /> Edit Employee profile
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
              Employee Profile
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[calc(100vh-290px)] overflow-hidden">
            <ScrollArea className="h-full" type="auto">
              <div className="pr-4 space-y-6 pb-8">
                {/* Personal Information */}
                <div>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">
                          First Name
                        </TableCell>
                        <TableCell>{employeeDetails?.firstName} </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">
                          Middle Name
                        </TableCell>
                        <TableCell>
                          {employeeDetails?.middleName || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">
                          Last Name
                        </TableCell>
                        <TableCell>{employeeDetails?.lastName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Employee ID
                        </TableCell>
                        <TableCell>{employeeDetails?.employeeId}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Date of Birth
                        </TableCell>
                        <TableCell>
                          {employeeDetails?.dateOfBirth
                            ? new Date(
                                employeeDetails.dateOfBirth
                              ).toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Contact Number
                        </TableCell>
                        <TableCell>
                          {employeeDetails?.contactNo || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Email</TableCell>
                        <TableCell>{employeeDetails?.email || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Address</TableCell>
                        <TableCell>
                          {employeeDetails?.address || "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Employment Details */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-2">
                    Employment Details
                  </h3>
                  <Separator className="mb-4" />
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">
                          Work Rate
                        </TableCell>
                        <TableCell>
                          ₱{employeeDetails?.workRate?.toFixed(2) || "0.00"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Banking Information */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-2">
                    Banking Information
                  </h3>
                  <Separator className="mb-4" />
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">
                          Bank Name
                        </TableCell>
                        <TableCell>
                          {employeeDetails?.bankName || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Bank Account Number
                        </TableCell>
                        <TableCell>
                          {employeeDetails?.bankNumber || "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Government IDs */}
                <div className="mt-8 mb-4">
                  <h3 className="text-lg font-medium mb-2">Government IDs</h3>
                  <Separator className="mb-4" />
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">
                          SSS Number
                        </TableCell>
                        <TableCell>{employeeDetails?.sss || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          PhilHealth ID
                        </TableCell>
                        <TableCell>{employeeDetails?.phic || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Pag-IBIG MID Number
                        </TableCell>
                        <TableCell>
                          {employeeDetails?.hdmfMid || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">TIN</TableCell>
                        <TableCell>{employeeDetails?.tin || "N/A"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="p-6">
      <div className="mb-4 flex flex-row justify-between">
        <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
          <ArrowLeft className="h-4 w-4" /> Go back
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
          <UserPen className="h-4 w-4" /> Edit Employee profile
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
          <div className="h-[calc(100vh-280px)] overflow-hidden">
            <ScrollArea className="h-full" type="auto">
              <div className="pr-4 space-y-6 pb-8">
                {/* Personal Information Skeleton */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <Separator className="mb-4" />
                  <Table>
                    <TableBody>
                      {[
                        "First Name",
                        "Middle Name", 
                        "Last Name", 
                        "Employee ID",
                        "Date of Birth",
                        "Contact Number",
                        "Email",
                        "Address"
                      ].map((field) => (
                        <TableRow key={field}>
                          <TableCell className="font-medium w-1/3">
                            {field}
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Employment Details Skeleton */}
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
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Banking Information Skeleton */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-2">
                    Banking Information
                  </h3>
                  <Separator className="mb-4" />
                  <Table>
                    <TableBody>
                      {["Bank Name", "Bank Account Number"].map((field) => (
                        <TableRow key={field}>
                          <TableCell className="font-medium w-1/3">
                            {field}
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Government IDs Skeleton */}
                <div className="mt-8 mb-4">
                  <h3 className="text-lg font-medium mb-2">
                    Government IDs
                  </h3>
                  <Separator className="mb-4" />
                  <Table>
                    <TableBody>
                      {["SSS Number", "PhilHealth ID", "Pag-IBIG MID Number", "TIN"].map((field) => (
                        <TableRow key={field}>
                          <TableCell className="font-medium w-1/3">
                            {field}
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        </TableRow>
                      ))}
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
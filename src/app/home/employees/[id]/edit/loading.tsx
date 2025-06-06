import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 mt-8 flex items-center">
        <div>
          <h1 className="text-3xl font-bold text-muted-foreground">
            Edit Employee profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Loading employee information...
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          disabled
        >
          <ArrowLeft className="h-4 w-4" /> Go back
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-400px)] pr-4">
        <div className="space-y-10">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-xl font-semibold border-b pb-2 mb-6 text-muted-foreground">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">First Name</p>
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Middle Name</p>
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Last Name</p>
                <Skeleton className="h-11 w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <Skeleton className="h-11 w-full" />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h2 className="text-xl font-semibold border-b pb-2 mb-6 text-muted-foreground">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Contact Number</p>
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email Address</p>
                <Skeleton className="h-11 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Address</p>
              <Skeleton className="h-[100px] w-full" />
            </div>
          </div>

          {/* Employment Information Section */}
          <div>
            <h2 className="text-xl font-semibold border-b pb-2 mb-6 text-muted-foreground">
              Employment Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Work Rate (₱)</p>
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Bank Name</p>
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Bank Account Number
                </p>
                <Skeleton className="h-11 w-full" />
              </div>
            </div>
          </div>

          {/* Government IDs Section */}
          <div>
            <h2 className="text-xl font-semibold border-b pb-2 mb-6 text-muted-foreground">
              Government IDs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">SSS Number</p>
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  PhilHealth Number
                </p>
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Pag-IBIG MID Number
                </p>
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">TIN</p>
                <Skeleton className="h-11 w-full" />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="mt-6 pb-4 border-t pt-6">
        <div className="flex items-center justify-end space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Preparing form...
          </span>
          <Button
            type="submit"
            className="px-8 py-6 text-base hover:cursor-pointer"
            disabled
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

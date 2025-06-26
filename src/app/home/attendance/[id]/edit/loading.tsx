import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 px-1">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Card 1 */}
        <div className="flex-1 min-w-0 space-y-4 border rounded-lg p-6">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex-1 min-w-0 space-y-4 border rounded-lg p-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex-1 min-w-0 space-y-4 border rounded-lg p-6">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-11" />
              </div>
            ))}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-11 w-full" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

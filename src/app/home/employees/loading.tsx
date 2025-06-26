"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container p-8 space-y-8 animate-in fade-in-50">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-10 w-28" />
      </div>
      
      {/* Search and Filter Skeleton */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-10 w-32" />
        <div className="ml-auto">
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      
      {/* Table Skeleton */}
      <Card className="overflow-hidden border shadow-sm">
        <CardHeader className="px-6 py-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-24" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="flex items-center px-6 py-3 bg-muted/30 border-b">
            <Skeleton className="h-4 w-8 mr-3" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`flex-1 ${i !== 4 ? 'mr-6' : ''}`}>
                <Skeleton className={`h-4 w-${i === 1 ? '3/4' : i === 4 ? '1/2' : 'full'}`} />
              </div>
            ))}
            <div className="w-12">
              <Skeleton className="h-4 w-8 ml-auto" />
            </div>
          </div>
          
          {/* Table Rows */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center px-6 py-4 border-b hover:bg-muted/20 transition-colors">
              <Skeleton className="h-4 w-5 mr-3" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`flex-1 ${i !== 4 ? 'mr-6' : ''}`}>
                  <Skeleton className={`h-4 w-${['4/5', '2/3', '3/4', '1/2'][i-1]}`} />
                </div>
              ))}
              <div className="w-12 flex justify-end">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between mt-6 px-2">
        <Skeleton className="h-5 w-36" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md opacity-70" />
          <Skeleton className="h-9 w-9 rounded-md opacity-70" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}
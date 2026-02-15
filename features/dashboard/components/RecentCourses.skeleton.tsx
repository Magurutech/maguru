'use client'

/**
 * RecentCourses Skeleton Component
 *
 * Loading state untuk RecentCourses.
 */

import { Skeleton } from '@/components/ui/skeleton'

export function RecentCoursesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-40" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-panel-light rounded-lg p-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-full max-w-xs" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-20 rounded-lg shrink-0" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

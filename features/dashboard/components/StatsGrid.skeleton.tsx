'use client'

/**
 * StatsGrid Skeleton Component
 *
 * Loading state untuk StatsGrid.
 */

import { Skeleton } from '@/components/ui/skeleton'

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

'use client'

/**
 * Recommendations Skeleton Component
 *
 * Loading state untuk Recommendations.
 */

import { Skeleton } from '@/components/ui/skeleton'

export function RecommendationsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-7 w-48" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass-panel-light rounded-lg p-5">
            <div className="flex items-start gap-3">
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-full max-w-xs" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

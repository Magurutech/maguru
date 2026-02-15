'use client'

/**
 * QuickActions Skeleton Component
 *
 * Loading state untuk QuickActions.
 */

import { Skeleton } from '@/components/ui/skeleton'

export function QuickActionsSkeleton() {
  return (
    <div className="glass-panel-light rounded-lg p-6">
      <Skeleton className="h-7 w-32 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

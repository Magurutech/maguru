'use client'

/**
 * DashboardHeader Skeleton Component
 *
 * Loading state untuk DashboardHeader.
 */

import { Skeleton } from '@/components/ui/skeleton'

export function DashboardHeaderSkeleton() {
  return (
    <div className="glass-panel-light rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  )
}

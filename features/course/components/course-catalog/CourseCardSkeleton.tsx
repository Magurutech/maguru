import React from 'react'

export function CourseCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl glass-panel card-ancient animate-pulse">
      <div className="aspect-video bg-white/10 rounded-t-2xl" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-white/10 rounded-lg" />
        <div className="h-4 bg-white/10 rounded w-2/3" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-white/10 rounded" />
          <div className="h-4 bg-white/10 rounded w-16" />
          <div className="h-4 bg-white/10 rounded w-20 ml-auto" />
        </div>
        <div className="h-10 bg-white/10 rounded-lg" />
      </div>
    </div>
  )
}

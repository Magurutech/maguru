import React from 'react'

export function CourseCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl glass-panel card-ancient animate-pulse">
      <div className="w-full h-48 bg-beige-200 animate-pulse rounded-t-lg flex items-center justify-center"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-white/10 rounded-lg" />
        <div className="h-4 bg-white/10 rounded-lg w-1/2" />
        <div className="h-4 bg-white/10 rounded-lg w-1/3" />
      </div>
    </div>
  )
}

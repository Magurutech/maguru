import React from 'react'
import { CourseCard } from './CourseCard'
import { CourseCardSkeleton } from './CourseCardSkeleton'
import { EmptyStateIllustration } from './EmptyStateIllustration'
import type { CourseCatalogItem } from '@/features/course/types'

interface CourseCatalogGridProps {
  courses: CourseCatalogItem[]
  loading: boolean
  onEnroll: (courseId: string) => void
  onWishlist: (courseId: string) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function CourseCatalogGrid({
  courses,
  loading,
  onEnroll,
  onWishlist,
  hasActiveFilters,
  onClearFilters,
}: CourseCatalogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? (
        Array.from({ length: 8 }).map((_, idx) => <CourseCardSkeleton key={idx} />)
      ) : courses.length === 0 ? (
        <EmptyStateIllustration
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
      ) : (
        courses.map((course) => (
          <CourseCard key={course.id} course={course} onEnroll={onEnroll} onWishlist={onWishlist} />
        ))
      )}
    </div>
  )
}

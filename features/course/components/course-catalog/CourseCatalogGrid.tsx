import React from 'react'
import { CourseCard } from './CourseCard'
import { CourseCardSkeleton } from './CourseCardSkeleton'
import { EmptyStateIllustration } from './EmptyStateIllustration'

interface Course {
  id: number
  title: string
  creator: string
  thumbnail: string
  rating: number
  students: number
  duration: string
  category: string
  price: number
  enrolled: boolean
  createdAt: string
  description: string
  longDescription: string
  curriculum: string[]
  wishlist: boolean
}

interface CourseCatalogGridProps {
  courses: Course[]
  loading: boolean
  onEnroll: (courseId: number) => void
  onWishlist: (courseId: number) => void
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

import React, { useMemo } from 'react'
import { CourseCard } from './CourseCardCatalog'
import { CourseCardSkeleton } from './CourseCardSkeleton'
import { EmptyStateIllustration } from './EmptyStateIllustration'
import { useCourseManagement } from '../../hooks/useCourseManagement'
import { useCourseContext } from '../../contexts/courseContext'
import { mockCoursesCatalog } from '../../lib/mockData'
import type { CourseCatalogItem } from '../../types'

export function CourseCatalogGrid() {
  // Feature state dari hooks dan context
  const { courses, isLoading } = useCourseManagement()
  const { hasActiveFilters, clearFilters } = useCourseContext()

  // Simplified hybrid data enrichment
  const enrichedCourses: CourseCatalogItem[] = useMemo(() => {
    return courses.map((course) => {
      const mockCourse = mockCoursesCatalog.find((mock) => mock.id === course.id)
      return {
        // Real data dari backend
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail || '/images/default-course-thumbnail.svg',
        category: course.category,
        creator: course.creatorId, // atau dari user service
        rating: course.rating,
        students: course.students,

        // Mock data untuk missing fields
        price: mockCourse?.price || 0,
        longDescription: mockCourse?.longDescription || course.description,
        curriculum: mockCourse?.curriculum || [],
        duration: mockCourse?.duration || '2 hours',

        // User-specific data (akan dihandle oleh enrollment hooks)
        enrolled: false, // akan diupdate oleh useEnrollmentStatus
        wishlist: false, // akan diupdate oleh wishlist hooks

        // Required field dari CourseCatalogItem
        createdAt:
          typeof course.createdAt === 'string'
            ? course.createdAt
            : course.createdAt?.toISOString?.() || String(course.createdAt),
      }
    })
  }, [courses])

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      data-testid="course-grid"
    >
      {isLoading ? (
        Array.from({ length: 8 }).map((_, idx) => <CourseCardSkeleton key={idx} />)
      ) : enrichedCourses.length === 0 ? (
        <EmptyStateIllustration hasActiveFilters={hasActiveFilters} onClearFilters={clearFilters} />
      ) : (
        enrichedCourses.map((course) => <CourseCard key={course.id} course={course} />)
      )}
    </div>
  )
}

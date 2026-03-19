'use client'

import { CourseCard } from '@/features/cms/components/student/CourseCard'
import type { CourseCardCourse } from '@/features/cms/types'
import { useEnrollment } from '@/features/cms/hooks'

/**
 * EnrollButton wrapper around CourseCard
 *
 * Handles the enroll POST call and redirects on success.
 * Wraps CourseCard so the server page stays a server component.
 *
 * Requirements: 2.1, 2.2, 2.7
 */

interface EnrollableCourseCardProps {
  course: CourseCardCourse
  enrolled: boolean
}

export function EnrollableCourseCard({ course, enrolled: initialEnrolled }: EnrollableCourseCardProps) {
  const { enrolled, enrolling, handleEnroll } = useEnrollment({
    courseId: course.id,
    courseTitle: course.title,
    initialEnrolled,
  })

  return (
    <CourseCard
      course={course}
      enrolled={enrolled}
      onEnroll={handleEnroll}
      enrolling={enrolling}
    />
  )
}

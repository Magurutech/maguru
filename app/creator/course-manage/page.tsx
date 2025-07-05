'use client'

import {
  CourseHeader,
  CourseStats,
  CourseSearchFilter,
  CourseGrid,
  CreateCourseDialog,
  EditCourseDialog,
  DeleteCourseDialog,
} from '@/features/course/components/course-manage'

export default function CourseManagePage() {
  return (
    <div className="min-h-screen bg-ancient-fantasy p-6">
      <CourseHeader />

      <CourseStats />

      <CourseSearchFilter />

      <CourseGrid />

      {/* Course Management Dialogs */}
      <CreateCourseDialog />
      <EditCourseDialog />
      <DeleteCourseDialog />
    </div>
  )
}

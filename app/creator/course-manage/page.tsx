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
import { CourseContextProvider } from '@/features/course/contexts/courseContext'

export default function CourseManagePage() {
  return (
    <CourseContextProvider>
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
    </CourseContextProvider>
  )
}

'use client'

import { useState } from 'react'
import {
  CourseHeader,
  CourseStats,
  CourseSearchFilter,
  CourseGrid,
  EmptyState,
  CreateCourseDialog,
  EditCourseDialog,
} from '@/features/course/course-manage/components'
import { metadataCourse } from '@/features/course/course-manage/lib/metadatCourse'
import { filterCourses } from '@/features/course/course-manage/lib/courseUtils'
import type { Course } from '@/features/course/course-manage/types'

export default function CourseManagePage() {
  const [courses, setCourses] = useState<Course[]>(metadataCourse)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const filteredCourses = filterCourses(courses, searchQuery, selectedStatus)

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter((course) => course.id !== courseId))
  }

  const handleResetFilter = () => {
    setSearchQuery('')
    setSelectedStatus('all')
  }

  return (
    <div className="min-h-screen bg-ancient-fantasy p-6">
      <CourseHeader />

      <CourseStats courses={courses} />

      <CourseSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onStatusChange={setSelectedStatus}
        onCreateCourse={() => setIsCreateDialogOpen(true)}
      />

      {filteredCourses.length > 0 ? (
        <CourseGrid
          courses={filteredCourses}
          onEdit={setEditingCourse}
          onDelete={handleDeleteCourse}
        />
      ) : (
        <EmptyState onResetFilter={handleResetFilter} />
      )}

      {/* Dialogs */}
      <CreateCourseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCourseCreated={(newCourse) => {
          setCourses([...courses, { ...newCourse, id: Date.now().toString() }])
          setIsCreateDialogOpen(false)
        }}
      />

      <EditCourseDialog
        course={editingCourse}
        open={!!editingCourse}
        onOpenChange={(open) => !open && setEditingCourse(null)}
        onCourseUpdated={(updatedCourse) => {
          setCourses(
            courses.map((course) => (course.id === updatedCourse.id ? updatedCourse : course)),
          )
          setEditingCourse(null)
        }}
      />
    </div>
  )
}

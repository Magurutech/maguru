import React from 'react'
import { useCourseManagement } from '../../hooks/useCourseManagement'

export function ResultsCount() {
  const { courses, isLoading } = useCourseManagement()

  return (
    <div className="mb-6">
      <p className="text-beige-700">
        {isLoading ? 'Loading courses...' : `Showing ${courses.length} courses`}
      </p>
    </div>
  )
}

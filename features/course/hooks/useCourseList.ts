'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { CourseListItem } from '../types/course.types'
import { getCourses, getAllCourseProgress } from '../api'

export function useCourseList() {
  const [courses, setCourses] = useState<CourseListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load courses data
  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getCourses()
      const allProgress = getAllCourseProgress()

      // Merge progress data with courses
      const coursesWithProgress = response.courses.map(course => ({
        ...course,
        progress: allProgress[course.slug]
      }))

      setCourses(coursesWithProgress)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses')
      console.error('Error loading courses:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  // Filter and sort courses dengan parameters eksternal
  const getCoursesFilteredAndSorted = useCallback((
    searchTerm: string,
    selectedLevel: string,
    sortBy: string
  ) => {
    return courses
      .filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             course.instructor.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel.toLowerCase()

        return matchesSearch && matchesLevel
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title)
          case 'instructor':
            return a.instructor.localeCompare(b.instructor)
          case 'duration':
            return a.duration.localeCompare(b.duration)
          case 'progress':
            const aProgress = a.progress?.completionPercentage || 0
            const bProgress = b.progress?.completionPercentage || 0
            return bProgress - aProgress
          default:
            return 0
        }
      })
  }, [courses])

  // Computed values
  const computed = useMemo(() => ({
    hasCourses: courses.length > 0,
    totalCourses: courses.length,
    coursesWithProgress: courses.filter(course => course.progress?.completionPercentage && course.progress.completionPercentage > 0).length
  }), [courses])

  return {
    // Data
    courses,
    loading,
    error,

    // Computed
    ...computed,

    // Actions
    refetch: loadCourses,
    getCoursesFilteredAndSorted
  }
}
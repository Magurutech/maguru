/**
 * useCourse Hook - Low-Level Hook
 *
 * @description
 * Low-level hook yang berinteraksi langsung dengan courseAdapter untuk operasi CRUD dasar.
 * Hook ini menyediakan interface yang clean untuk:
 * - Fetching courses (list dan detail)
 * - Creating courses
 * - Updating courses
 * - Deleting courses
 * - Status updates
 *
 * Mengikuti arsitektur Maguru untuk low-level hooks dengan:
 * - Direct interaction dengan adapter layer
 * - Error handling yang konsisten
 * - Type safety dengan TypeScript
 * - Retry logic dan fallback mechanisms
 * - Designing for failure principles
 *
 * Hook ini akan digunakan oleh high-level hooks untuk logika bisnis yang lebih kompleks.
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import { CourseAdapter } from '../adapters/courseAdapter'
import type { Course, CreateCourseRequest, UpdateCourseRequest } from '../../types'

// Retry configuration untuk designing for failure
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000, // 10 seconds
}

// Retry utility function dengan exponential backoff
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = RETRY_CONFIG.maxRetries,
  delay: number = RETRY_CONFIG.retryDelay,
): Promise<T> => {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.timeout)

      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), RETRY_CONFIG.timeout),
        ),
      ])

      clearTimeout(timeoutId)
      return result
    } catch (error) {
      lastError = error as Error

      if (attempt === maxRetries) {
        throw lastError
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)))
    }
  }

  throw lastError!
}

// Hook return type
interface UseCourseReturn {
  // Data states
  courses: Course[]
  currentCourse: Course | null

  // Loading states
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Error state
  error: string | null

  // Pagination
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }

  // CRUD operations
  fetchCourses: (page?: number, limit?: number) => Promise<void>
  fetchCourseById: (id: string) => Promise<void>
  fetchCoursesByCreator: (creatorId: string, page?: number, limit?: number) => Promise<void>
  createCourse: (courseData: CreateCourseRequest) => Promise<Course | null>
  updateCourse: (id: string, courseData: UpdateCourseRequest) => Promise<Course | null>
  deleteCourse: (id: string) => Promise<boolean>
  updateCourseStatus: (id: string, status: string) => Promise<Course | null>

  // Utility functions
  clearError: () => void
  resetState: () => void
}

// Initial state
const initialState = {
  courses: [],
  currentCourse: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
}

export function useCourse(): UseCourseReturn {
  // State management
  const [courses, setCourses] = useState<Course[]>(initialState.courses)
  const [currentCourse, setCurrentCourse] = useState<Course | null>(initialState.currentCourse)
  const [isLoading, setIsLoading] = useState(initialState.isLoading)
  const [isCreating, setIsCreating] = useState(initialState.isCreating)
  const [isUpdating, setIsUpdating] = useState(initialState.isUpdating)
  const [isDeleting, setIsDeleting] = useState(initialState.isDeleting)
  const [error, setError] = useState<string | null>(initialState.error)
  const [pagination, setPagination] = useState(initialState.pagination)

  // Cache untuk graceful fallback
  const cachedCourses = useRef<Course[]>([])

  // Utility functions
  const clearError = useCallback(() => setError(null), [])

  const resetState = useCallback(() => {
    setCourses(initialState.courses)
    setCurrentCourse(initialState.currentCourse)
    setIsLoading(initialState.isLoading)
    setIsCreating(initialState.isCreating)
    setIsUpdating(initialState.isUpdating)
    setIsDeleting(initialState.isDeleting)
    setError(initialState.error)
    setPagination(initialState.pagination)
  }, [])

  // Fetch courses (public) dengan retry dan fallback
  const fetchCourses = useCallback(async (page: number = 1, limit: number = 10) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await retryWithBackoff(() => CourseAdapter.getCourses(page, limit))

      if (response.success && response.data) {
        setCourses(response.data.courses)
        setPagination(response.data.pagination)
        // Cache successful response untuk fallback
        cachedCourses.current = response.data.courses
      } else {
        setError(response.error || 'Failed to fetch courses')
        // Graceful fallback ke cached data
        if (cachedCourses.current.length > 0) {
          console.warn('Using cached data due to fetch failure')
          setCourses(cachedCourses.current)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch courses'
      setError(errorMessage)

      // Graceful fallback ke cached data
      if (cachedCourses.current.length > 0) {
        console.warn('Using cached data due to network failure')
        setCourses(cachedCourses.current)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch course by ID dengan retry
  const fetchCourseById = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await retryWithBackoff(() => CourseAdapter.getCourseById(id))

      if (response.success && response.data) {
        setCurrentCourse(response.data)
      } else {
        setError(response.error || 'Failed to fetch course')
        setCurrentCourse(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course')
      setCurrentCourse(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch courses by creator dengan retry dan fallback
  const fetchCoursesByCreator = useCallback(
    async (creatorId: string, page: number = 1, limit: number = 10) => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await retryWithBackoff(() =>
          CourseAdapter.getCoursesByCreator(creatorId, page, limit),
        )

        if (response.success && response.data) {
          setCourses(response.data.courses)
          setPagination(response.data.pagination)
          // Cache successful response untuk fallback
          cachedCourses.current = response.data.courses
        } else {
          setError(response.error || 'Failed to fetch creator courses')
          // Graceful fallback ke cached data
          if (cachedCourses.current.length > 0) {
            console.warn('Using cached data due to fetch failure')
            setCourses(cachedCourses.current)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch creator courses')
        // Graceful fallback ke cached data
        if (cachedCourses.current.length > 0) {
          console.warn('Using cached data due to network failure')
          setCourses(cachedCourses.current)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Create course dengan retry
  const createCourse = useCallback(
    async (courseData: CreateCourseRequest): Promise<Course | null> => {
      try {
        setIsCreating(true)
        setError(null)

        const response = await retryWithBackoff(() => CourseAdapter.createCourse(courseData))

        if (response.success && response.data) {
          const newCourse = response.data
          setCourses((prev) => [newCourse, ...prev])
          return newCourse
        } else {
          setError(response.error || 'Failed to create course')
          return null
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create course'
        setError(errorMessage)
        return null
      } finally {
        setIsCreating(false)
      }
    },
    [],
  )

  // Update course dengan retry dan optimistic update
  const updateCourse = useCallback(
    async (id: string, courseData: UpdateCourseRequest): Promise<Course | null> => {
      try {
        setIsUpdating(true)
        setError(null)

        // Optimistic update
        const optimisticCourse = { ...currentCourse, ...courseData } as Course
        setCourses((prev) => prev.map((course) => (course.id === id ? optimisticCourse : course)))

        const response = await retryWithBackoff(() => CourseAdapter.updateCourse(id, courseData))

        if (response.success && response.data) {
          const updatedCourse = response.data
          setCourses((prev) => prev.map((course) => (course.id === id ? updatedCourse : course)))

          // Update current course if it's the one being updated
          if (currentCourse?.id === id) {
            setCurrentCourse(updatedCourse)
          }

          return updatedCourse
        } else {
          // Revert optimistic update on failure
          setCourses((prev) => prev.map((course) => (course.id === id ? currentCourse! : course)))
          setError(response.error || 'Failed to update course')
          return null
        }
      } catch (err) {
        // Revert optimistic update on error
        setCourses((prev) => prev.map((course) => (course.id === id ? currentCourse! : course)))
        const errorMessage = err instanceof Error ? err.message : 'Failed to update course'
        setError(errorMessage)
        return null
      } finally {
        setIsUpdating(false)
      }
    },
    [currentCourse],
  )

  // Delete course dengan retry dan optimistic delete
  const deleteCourse = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsDeleting(true)
        setError(null)

        // Optimistic delete
        const courseToDelete = courses.find((course) => course.id === id)
        setCourses((prev) => prev.filter((course) => course.id !== id))

        const response = await retryWithBackoff(() => CourseAdapter.deleteCourse(id))

        if (response.success) {
          // Clear current course if it's the one being deleted
          if (currentCourse?.id === id) {
            setCurrentCourse(null)
          }
          return true
        } else {
          // Revert optimistic delete on failure
          if (courseToDelete) {
            setCourses((prev) => [...prev, courseToDelete])
          }
          setError(response.error || 'Failed to delete course')
          return false
        }
      } catch (err) {
        // Revert optimistic delete on error
        const courseToDelete = courses.find((course) => course.id === id)
        if (courseToDelete) {
          setCourses((prev) => [...prev, courseToDelete])
        }
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete course'
        setError(errorMessage)
        return false
      } finally {
        setIsDeleting(false)
      }
    },
    [currentCourse?.id, courses],
  )

  // Update course status dengan retry dan optimistic update
  const updateCourseStatus = useCallback(
    async (id: string, status: string): Promise<Course | null> => {
      try {
        setIsUpdating(true)
        setError(null)

        // Optimistic update
        const optimisticCourse = { ...currentCourse, status } as Course
        setCourses((prev) => prev.map((course) => (course.id === id ? optimisticCourse : course)))

        const response = await retryWithBackoff(() => CourseAdapter.updateCourseStatus(id, status))

        if (response.success && response.data) {
          const updatedCourse = response.data
          setCourses((prev) => prev.map((course) => (course.id === id ? updatedCourse : course)))

          // Update current course if it's the one being updated
          if (currentCourse?.id === id) {
            setCurrentCourse(updatedCourse)
          }

          return updatedCourse
        } else {
          // Revert optimistic update on failure
          setCourses((prev) => prev.map((course) => (course.id === id ? currentCourse! : course)))
          setError(response.error || 'Failed to update course status')
          return null
        }
      } catch (err) {
        // Revert optimistic update on error
        setCourses((prev) => prev.map((course) => (course.id === id ? currentCourse! : course)))
        const errorMessage = err instanceof Error ? err.message : 'Failed to update course status'
        setError(errorMessage)
        return null
      } finally {
        setIsUpdating(false)
      }
    },
    [currentCourse],
  )

  return {
    // Data states
    courses,
    currentCourse,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,

    // Error state
    error,

    // Pagination
    pagination,

    // CRUD operations
    fetchCourses,
    fetchCourseById,
    fetchCoursesByCreator,
    createCourse,
    updateCourse,
    deleteCourse,
    updateCourseStatus,

    // Utility functions
    clearError,
    resetState,
  }
}

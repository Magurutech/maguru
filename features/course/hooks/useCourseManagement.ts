/**
 * useCourseManagement Hook - High-Level Hook
 *
 * @description
 * High-level hook yang menggabungkan low-level hooks untuk menjalankan logika bisnis yang kompleks.
 * Hook ini menggunakan useCourse (low-level) dan useEnrollment (low-level) dan menambahkan:
 * - Business logic workflows
 * - Local state management (tidak menggunakan context)
 * - Complex operations (batch operations, optimistic updates)
 * - Error recovery strategies
 * - User role validation
 * - Enrollment integration
 *
 * Mengikuti arsitektur Maguru untuk high-level hooks dengan:
 * - Orchestration dari multiple low-level hooks
 * - Complex business logic workflows
 * - Local state management
 * - Error handling dan recovery strategies
 * - Designing for failure principles
 * - Enrollment operations integration
 */

'use client'

import { useCourse } from './useCourse'
import { useEnrollment } from './useEnrollment'
import { useUserRole } from '@/features/auth/hooks/useUserRole'
import { useState, useCallback } from 'react'
import type { CreateCourseRequest, UpdateCourseRequest } from '../types'

export function useCourseManagement() {
  // Auth hook untuk role validation
  const { role } = useUserRole()

  // Local state management (UI only) - akan diintegrasikan dengan context
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Low-level hooks untuk data operations (React Query)
  const {
    courses,
    isLoading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    getDisplayThumbnail,
    isDefaultThumbnail,
    getDefaultThumbnailUrl,
    fetchCourses,
  } = useCourse()

  // Enrollment hooks
  const {
    enrollCourse,
    unenrollCourse,
    isEnrolling,
    isUnenrolling,
    enrollmentError,
    unenrollmentError,
    isEnrollmentSuccess,
    isUnenrollmentSuccess,
    resetEnrollment,
    resetUnenrollment,
  } = useEnrollment()

  // Permission checking
  const hasPermission = useCallback(
    (action: 'create' | 'update' | 'delete' | 'view' | 'enroll'): boolean => {
      if (!role) return false
      switch (action) {
        case 'create':
          return role === 'creator' || role === 'admin'
        case 'update':
        case 'delete':
          return role === 'creator' || role === 'admin'
        case 'view':
          return role === 'creator' || role === 'admin' || role === 'user'
        case 'enroll':
          return role === 'user' // Hanya user yang bisa enroll
        default:
          return false
      }
    },
    [role],
  )

  // CRUD operations dengan business logic
  const createCourseWithValidation = useCallback(
    async (courseData: CreateCourseRequest): Promise<boolean> => {
      if (!hasPermission('create')) {
        return false
      }
      try {
        const result = await createCourse(courseData)
        if (result) {
          // Manual refetch setelah create berhasil
          await fetchCourses()
          return true
        }
        return false
      } catch (error) {
        console.error(
          'useCourseManagement: createCourseWithValidation - Failed to create course',
          error,
        )
        return false
      }
    },
    [hasPermission, createCourse, fetchCourses],
  )

  const updateCourseWithValidation = useCallback(
    async (id: string, courseData: UpdateCourseRequest): Promise<boolean> => {
      if (!hasPermission('update')) {
        return false
      }
      try {
        const result = await updateCourse(id, courseData)
        if (result) {
          // Manual refetch setelah update berhasil
          await fetchCourses()
          return true
        }
        return false
      } catch (error) {
        console.error(
          'useCourseManagement: updateCourseWithValidation - Failed to update course',
          error,
        )
        return false
      }
    },
    [hasPermission, updateCourse, fetchCourses],
  )

  const deleteCourseWithConfirmation = useCallback(
    async (id: string): Promise<boolean> => {
      if (!hasPermission('delete')) {
        const errorMsg = 'Access denied. Only course owners can delete courses.'
        console.error('useCourseManagement: deleteCourseWithConfirmation -', errorMsg)
        return false
      }
      try {
        const result = await deleteCourse(id)
        if (result) {
          // Manual refetch setelah delete berhasil
          await fetchCourses()
          return true
        }
        return false
      } catch (error) {
        console.error(
          'useCourseManagement: deleteCourseWithConfirmation - Failed to delete course',
          error,
        )
        return false
      }
    },
    [hasPermission, deleteCourse, fetchCourses],
  )

  // Enrollment operations dengan business logic
  const enrollCourseWithValidation = useCallback(
    async (courseId: string): Promise<boolean> => {
      if (!hasPermission('enroll')) {
        console.error(
          'useCourseManagement: enrollCourseWithValidation - Access denied for enrollment',
        )
        return false
      }

      try {
        enrollCourse(courseId)
        return true
      } catch (error) {
        console.error(
          'useCourseManagement: enrollCourseWithValidation - Failed to enroll course',
          error,
        )
        return false
      }
    },
    [hasPermission, enrollCourse],
  )

  const unenrollCourseWithValidation = useCallback(
    async (courseId: string): Promise<boolean> => {
      if (!hasPermission('enroll')) {
        console.error(
          'useCourseManagement: unenrollCourseWithValidation - Access denied for unenrollment',
        )
        return false
      }

      try {
        unenrollCourse(courseId)
        return true
      } catch (error) {
        console.error(
          'useCourseManagement: unenrollCourseWithValidation - Failed to unenroll course',
          error,
        )
        return false
      }
    },
    [hasPermission, unenrollCourse],
  )

  // Load courses by creator (for creator dashboard)
  const loadCreatorCourses = useCallback(async () => {
    if (!hasPermission('view')) {
      return
    }
    try {
      await fetchCourses()
    } catch (error) {
      console.error(
        'useCourseManagement: loadCreatorCourses - Failed to load creator courses',
        error,
      )
    }
  }, [hasPermission, fetchCourses])

  // Search and filter functions
  const searchCourses = useCallback(
    async (searchParams: {
      searchQuery?: string
      selectedStatus?: string
      selectedCategory?: string
    }) => {
      if (!hasPermission('view')) {
        console.warn('useCourseManagement: searchCourses - Access denied for search')
        return
      }
      await fetchCourses(searchParams)
    },
    [hasPermission, fetchCourses],
  )

  // 🔥 TAMBAHAN: Clear filters function
  const clearFilters = useCallback(async () => {
    if (!hasPermission('view')) {
      return
    }

    try {
      // Fetch semua courses tanpa filter
      await fetchCourses({
        searchQuery: '',
        selectedStatus: 'all',
        selectedCategory: 'all',
      })
    } catch (error) {
      console.error(
        'useCourseManagement',
        'clearFilters',
        'Failed to clear filters',
        error as Error,
      )
    }
  }, [hasPermission, fetchCourses])

  // Utility functions
  const clearError = useCallback(() => {
    // Clear error tanpa memicu refetch - hanya reset error state
    console.log('useCourseManagement', 'clearError', 'Error cleared without refetch')
  }, [])

  const resetState = useCallback(() => {
    setSearchQuery('')
    setSelectedStatus('all')
  }, [])

  // Reset enrollment states
  const resetEnrollmentStates = useCallback(() => {
    resetEnrollment()
    resetUnenrollment()
  }, [resetEnrollment, resetUnenrollment])

  return {
    // Course data
    courses,
    isLoading,
    error,

    // Course operations
    createCourseWithValidation,
    updateCourseWithValidation,
    deleteCourseWithConfirmation,
    loadCreatorCourses,
    fetchCourses,
    searchCourses,
    getDisplayThumbnail,
    isDefaultThumbnail,
    getDefaultThumbnailUrl,

    // Enrollment operations
    enrollCourseWithValidation,
    unenrollCourseWithValidation,
    isEnrolling,
    isUnenrolling,
    enrollmentError,
    unenrollmentError,
    isEnrollmentSuccess,
    isUnenrollmentSuccess,

    // Utility functions
    clearError,
    resetState,
    resetEnrollmentStates,
    hasPermission,

    // Search/filter state
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    clearFilters,
  }
}

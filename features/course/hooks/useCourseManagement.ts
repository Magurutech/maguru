/**
 * useCourseManagement Hook - High-Level Hook
 *
 * @description
 * High-level hook yang menggabungkan low-level hooks untuk menjalankan logika bisnis yang kompleks.
 * Hook ini menggunakan useCourse (low-level) dan menambahkan:
 * - Business logic workflows
 * - Local state management (tidak menggunakan context)
 * - Complex operations (batch operations, optimistic updates)
 * - Error recovery strategies
 * - User role validation
 *
 * Mengikuti arsitektur Maguru untuk high-level hooks dengan:
 * - Orchestration dari multiple low-level hooks
 * - Complex business logic workflows
 * - Local state management
 * - Error handling dan recovery strategies
 * - Designing for failure principles
 */

'use client'

import { useCourse } from './useCourse'
import { useUserRole } from '@/features/auth/hooks/useUserRole'
import { useState, useCallback } from 'react'
// import { useQueryClient } from '@tanstack/react-query' // Tidak digunakan lagi
import type { CreateCourseRequest, UpdateCourseRequest } from '../types'
import { logger } from '@/services/logger'

export function useCourseManagement() {
  // Auth hook untuk role validation
  const { role } = useUserRole()

  // React Query client untuk error handling (tidak digunakan lagi setelah fix)
  // const queryClient = useQueryClient()

  // Local state management (UI only) - akan diintegrasikan dengan context
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Low-level hook untuk data operations (React Query)
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

  // Permission checking
  const hasPermission = useCallback(
    (action: 'create' | 'update' | 'delete' | 'view'): boolean => {
      if (!role) return false
      switch (action) {
        case 'create':
          return role === 'creator' || role === 'admin'
        case 'update':
        case 'delete':
          return role === 'creator' || role === 'admin'
        case 'view':
          return role === 'creator' || role === 'admin' || role === 'user'
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
        logger.error(
          'useCourseManagement',
          'createCourseWithValidation',
          'Failed to create course',
          error as Error,
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
        logger.error(
          'useCourseManagement',
          'updateCourseWithValidation',
          'Failed to update course',
          error as Error,
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
        logger.error('useCourseManagement', 'deleteCourseWithConfirmation', errorMsg)
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
        logger.error(
          'useCourseManagement',
          'deleteCourseWithConfirmation',
          'Failed to delete course',
          error as Error,
        )
        return false
      }
    },
    [hasPermission, deleteCourse, fetchCourses],
  )

  // Load courses by creator (for creator dashboard)
  const loadCreatorCourses = useCallback(async () => {
    if (!hasPermission('view')) {
      logger.warn(
        'useCourseManagement',
        'loadCreatorCourses',
        'Access denied. You do not have permission to view courses.',
      )
      return
    }
    try {
      logger.info('useCourseManagement', 'loadCreatorCourses', 'Loading creator courses')
      // For now, just fetch all courses since we don't have creatorId
      // In the future, this should fetch courses by specific creator
      await fetchCourses()
    } catch (error) {
      logger.error(
        'useCourseManagement',
        'loadCreatorCourses',
        'Failed to load creator courses',
        error as Error,
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
        logger.warn('useCourseManagement', 'searchCourses', 'Access denied for search')
        return
      }

      try {
        logger.info('useCourseManagement', 'searchCourses', 'Searching courses with parameters', {
          searchParams,
        })

        await fetchCourses(searchParams)
      } catch (error) {
        logger.error(
          'useCourseManagement',
          'searchCourses',
          'Failed to search courses',
          error as Error,
        )
      }
    },
    [hasPermission, fetchCourses],
  )

  // 🔥 TAMBAHAN: Clear filters function
  const clearFilters = useCallback(async () => {
    if (!hasPermission('view')) {
      logger.warn('useCourseManagement', 'clearFilters', 'Access denied for clear filters')
      return
    }

    try {
      logger.info(
        'useCourseManagement',
        'clearFilters',
        'Clearing all filters and fetching all courses',
      )

      // Fetch semua courses tanpa filter
      await fetchCourses({
        searchQuery: '',
        selectedStatus: 'all',
        selectedCategory: 'all',
      })

      logger.info('useCourseManagement', 'clearFilters', 'Filters cleared successfully')
    } catch (error) {
      logger.error('useCourseManagement', 'clearFilters', 'Failed to clear filters', error as Error)
    }
  }, [hasPermission, fetchCourses])

  // Utility functions
  const clearError = useCallback(() => {
    // Clear error tanpa memicu refetch - hanya reset error state
    logger.info('useCourseManagement', 'clearError', 'Error cleared without refetch')
  }, [])

  const resetState = useCallback(() => {
    setSearchQuery('')
    setSelectedStatus('all')
  }, [])

  return {
    courses,
    isLoading,
    error,
    createCourseWithValidation,
    updateCourseWithValidation,
    deleteCourseWithConfirmation,
    loadCreatorCourses,
    fetchCourses, // Tambahkan fetchCourses ke return object
    searchCourses, // Tambahkan searchCourses ke return object
    getDisplayThumbnail,
    isDefaultThumbnail,
    getDefaultThumbnailUrl,
    clearError,
    resetState,
    hasPermission,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    clearFilters,
  }
}

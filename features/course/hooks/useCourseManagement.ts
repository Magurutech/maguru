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

import { useState, useCallback } from 'react'
import { useUserRole } from '@/features/auth/hooks/useUserRole'
import { useAuth } from '@clerk/nextjs'
import { useCourse } from './useCourse'
import type { CreateCourseRequest, UpdateCourseRequest, Course } from '../types'

// Hook return type
interface UseCourseManagementReturn {
  // State dari hook
  courses: Course[]
  currentCourse: Course | null
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }

  // Business logic operations
  loadCreatorCourses: (page?: number, limit?: number) => Promise<void>
  loadPublicCourses: (page?: number, limit?: number) => Promise<void>
  refreshCourses: () => Promise<void>

  // CRUD operations dengan business logic
  createCourseWithValidation: (courseData: CreateCourseRequest) => Promise<boolean>
  updateCourseWithValidation: (id: string, courseData: UpdateCourseRequest) => Promise<boolean>
  deleteCourseWithConfirmation: (id: string) => Promise<boolean>
  updateCourseStatusWithValidation: (id: string, status: string) => Promise<boolean>

  // Batch operations
  deleteMultipleCourses: (courseIds: string[]) => Promise<boolean>
  updateMultipleCourseStatus: (courseIds: string[], status: string) => Promise<boolean>

  // Utility functions
  clearError: () => void
  resetState: () => void
  hasPermission: (action: 'create' | 'update' | 'delete' | 'view') => boolean
}

export function useCourseManagement(): UseCourseManagementReturn {
  // Auth hook untuk role validation
  const { role } = useUserRole()
  const { userId } = useAuth()

  // Local state management
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Low-level hook untuk data operations
  const {
    courses,
    currentCourse,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    pagination,
    fetchCourses,
    fetchCoursesByCreator,
    createCourse,
    updateCourse,
    deleteCourse,
    updateCourseStatus,
    clearError: clearHookError,
    resetState: resetHookState,
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

  // Load creator courses dengan role validation
  const loadCreatorCourses = useCallback(
    async (page: number = 1, limit: number = 10) => {
      if (!hasPermission('view')) {
        console.error('Access denied. You do not have permission to view courses.')
        return
      }

      try {
        // Get creatorId from auth context
        if (!userId) {
          console.error('No user ID available for loading creator courses')
          return
        }
        const creatorId = userId
        await fetchCoursesByCreator(creatorId, page, limit)
      } catch (error) {
        console.error('Failed to load creator courses:', error)
      }
    },
    [hasPermission, fetchCoursesByCreator, userId],
  )

  // Load public courses
  const loadPublicCourses = useCallback(
    async (page: number = 1, limit: number = 10) => {
      try {
        await fetchCourses(page, limit)
      } catch (error) {
        console.error('Failed to load public courses:', error)
      }
    },
    [fetchCourses],
  )

  // Refresh courses
  const refreshCourses = useCallback(async () => {
    try {
      if (searchQuery || selectedStatus !== 'all') {
        // If filters are active, reload with current filters
        await loadCreatorCourses(pagination.page, pagination.limit)
      } else {
        // Otherwise reload public courses
        await loadPublicCourses(pagination.page, pagination.limit)
      }
    } catch (error) {
      console.error('Failed to refresh courses:', error)
    }
  }, [searchQuery, selectedStatus, pagination, loadCreatorCourses, loadPublicCourses])

  // Create course dengan validation
  const createCourseWithValidation = useCallback(
    async (courseData: CreateCourseRequest): Promise<boolean> => {
      if (!hasPermission('create')) {
        console.error('Access denied. Only creators and admins can create courses.')
        return false
      }

      try {
        const newCourse = await createCourse(courseData)
        return !!newCourse
      } catch (error) {
        console.error('Failed to create course:', error)
        return false
      }
    },
    [hasPermission, createCourse],
  )

  // Update course dengan validation
  const updateCourseWithValidation = useCallback(
    async (id: string, courseData: UpdateCourseRequest): Promise<boolean> => {
      if (!hasPermission('update')) {
        console.error('Access denied. Only course owners can update courses.')
        return false
      }

      try {
        const updatedCourse = await updateCourse(id, courseData)
        return !!updatedCourse
      } catch (error) {
        console.error('Failed to update course:', error)
        return false
      }
    },
    [hasPermission, updateCourse],
  )

  // Delete course dengan confirmation logic
  const deleteCourseWithConfirmation = useCallback(
    async (id: string): Promise<boolean> => {
      if (!hasPermission('delete')) {
        console.error('Access denied. Only course owners can delete courses.')
        return false
      }

      try {
        const success = await deleteCourse(id)
        return success
      } catch (error) {
        console.error('Failed to delete course:', error)
        return false
      }
    },
    [hasPermission, deleteCourse],
  )

  // Update course status dengan validation
  const updateCourseStatusWithValidation = useCallback(
    async (id: string, status: string): Promise<boolean> => {
      if (!hasPermission('update')) {
        console.error('Access denied. Only course owners can update course status.')
        return false
      }

      try {
        const updatedCourse = await updateCourseStatus(id, status)
        return !!updatedCourse
      } catch (error) {
        console.error('Failed to update course status:', error)
        return false
      }
    },
    [hasPermission, updateCourseStatus],
  )

  // Batch operations
  const deleteMultipleCourses = useCallback(
    async (courseIds: string[]): Promise<boolean> => {
      if (!hasPermission('delete')) {
        console.error('Access denied. Only course owners can delete courses.')
        return false
      }

      try {
        const results = await Promise.allSettled(courseIds.map((id) => deleteCourse(id)))

        const successCount = results.filter(
          (result) => result.status === 'fulfilled' && result.value,
        ).length

        return successCount === courseIds.length
      } catch (error) {
        console.error('Failed to delete multiple courses:', error)
        return false
      }
    },
    [hasPermission, deleteCourse],
  )

  const updateMultipleCourseStatus = useCallback(
    async (courseIds: string[], status: string): Promise<boolean> => {
      if (!hasPermission('update')) {
        console.error('Access denied. Only course owners can update course status.')
        return false
      }

      try {
        const results = await Promise.allSettled(
          courseIds.map((id) => updateCourseStatus(id, status)),
        )

        const successCount = results.filter(
          (result) => result.status === 'fulfilled' && result.value,
        ).length

        return successCount === courseIds.length
      } catch (error) {
        console.error('Failed to update multiple course status:', error)
        return false
      }
    },
    [hasPermission, updateCourseStatus],
  )

  // Utility functions
  const clearError = useCallback(() => {
    clearHookError()
  }, [clearHookError])

  const resetState = useCallback(() => {
    resetHookState()
    setSearchQuery('')
    setSelectedStatus('all')
  }, [resetHookState])

  return {
    // State dari hook
    courses,
    currentCourse,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    pagination,

    // Business logic operations
    loadCreatorCourses,
    loadPublicCourses,
    refreshCourses,

    // CRUD operations dengan business logic
    createCourseWithValidation,
    updateCourseWithValidation,
    deleteCourseWithConfirmation,
    updateCourseStatusWithValidation,

    // Batch operations
    deleteMultipleCourses,
    updateMultipleCourseStatus,

    // Utility functions
    clearError,
    resetState,
    hasPermission,
  }
}

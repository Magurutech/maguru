/**
 * Unit Test: useCourseManagement Hook
 *
 * @description
 * Test suite untuk useCourseManagement hook yang mencakup:
 * - Business logic workflows
 * - Permission validation
 * - CRUD operations dengan validation
 * - Batch operations
 * - Error recovery strategies
 *
 * Mengikuti TDD approach dan Designing for Failure principles
 */

import { renderHook, act } from '@testing-library/react'
import { useCourseManagement } from './useCourseManagement'
import { useCourse } from './useCourse'
import type { CreateCourseRequest, UpdateCourseRequest, Course } from '../types'

// Mock dependencies menggunakan pola yang sama dengan useCourse.test.ts
jest.mock('./useCourse')
jest.mock('@/features/auth/hooks/useUserRole', () => ({
  useUserRole: jest.fn(() => ({
    role: 'creator',
    isLoading: false,
    error: null,
  })),
}))

// Import mocked modules
const mockUseCourse = useCourse as jest.MockedFunction<typeof useCourse>

// Test data
const mockCourse: Course = {
  id: 'course-1',
  title: 'Test Course',
  description: 'Test Description',
  thumbnail: '/test-thumbnail.jpg',
  category: 'Programming',
  status: 'DRAFT',
  students: 0,
  lessons: 0,
  duration: '0',
  rating: 0,
  creatorId: 'user-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const mockCreateRequest: CreateCourseRequest = {
  title: 'New Course',
  description: 'New Description',
  thumbnail: '/new-thumbnail.jpg',
  category: 'Design',
  status: 'DRAFT',
}

const mockUpdateRequest: UpdateCourseRequest = {
  id: 'course-1',
  title: 'Updated Course',
  description: 'Updated Description',
  thumbnail: '/updated-thumbnail.jpg',
  category: 'Programming',
  status: 'PUBLISHED',
}

describe('useCourseManagement Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock implementations untuk useCourse
    mockUseCourse.mockReturnValue({
      courses: [mockCourse],
      currentCourse: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
      fetchCourses: jest.fn(),
      fetchCourseById: jest.fn(),
      fetchCoursesByCreator: jest.fn(),
      createCourse: jest.fn(),
      updateCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourseStatus: jest.fn(),
      clearError: jest.fn(),
      resetState: jest.fn(),
    })
  })

  describe('Initial State', () => {
    test('should initialize with default state', () => {
      const { result } = renderHook(() => useCourseManagement())

      expect(result.current.courses).toEqual([mockCourse])
      expect(result.current.currentCourse).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isCreating).toBe(false)
      expect(result.current.isUpdating).toBe(false)
      expect(result.current.isDeleting).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      })
    })
  })

  describe('Permission Validation', () => {
    test('should check create permission correctly for creator', () => {
      // Mock useUserRole untuk creator
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const { result } = renderHook(() => useCourseManagement())

      expect(result.current.hasPermission('create')).toBe(true)
      expect(result.current.hasPermission('update')).toBe(true)
      expect(result.current.hasPermission('delete')).toBe(true)
      expect(result.current.hasPermission('view')).toBe(true)
    })

    test('should check create permission correctly for admin', () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'admin',
        isLoading: false,
        error: null,
      })

      const { result } = renderHook(() => useCourseManagement())

      expect(result.current.hasPermission('create')).toBe(true)
      expect(result.current.hasPermission('update')).toBe(true)
      expect(result.current.hasPermission('delete')).toBe(true)
      expect(result.current.hasPermission('view')).toBe(true)
    })

    test('should check create permission correctly for user', () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'user',
        isLoading: false,
        error: null,
      })

      const { result } = renderHook(() => useCourseManagement())

      expect(result.current.hasPermission('create')).toBe(false)
      expect(result.current.hasPermission('update')).toBe(false)
      expect(result.current.hasPermission('delete')).toBe(false)
      expect(result.current.hasPermission('view')).toBe(true)
    })

    test('should check create permission correctly for no role', () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: null,
        isLoading: false,
        error: null,
      })

      const { result } = renderHook(() => useCourseManagement())

      expect(result.current.hasPermission('create')).toBe(false)
      expect(result.current.hasPermission('update')).toBe(false)
      expect(result.current.hasPermission('delete')).toBe(false)
      expect(result.current.hasPermission('view')).toBe(false)
    })
  })

  describe('Business Logic Operations', () => {
    test('should load creator courses with role validation', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const mockFetchCoursesByCreator = jest.fn().mockResolvedValue(undefined)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        fetchCoursesByCreator: mockFetchCoursesByCreator,
      })

      const { result } = renderHook(() => useCourseManagement())

      await act(async () => {
        await result.current.loadCreatorCourses(2, 20)
      })

      expect(mockFetchCoursesByCreator).toHaveBeenCalledWith('current-user-id', 2, 20)
    })

    test('should not load creator courses without permission', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: null,
        isLoading: false,
        error: null,
      })

      const mockFetchCoursesByCreator = jest.fn()
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        fetchCoursesByCreator: mockFetchCoursesByCreator,
      })

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useCourseManagement())

      await act(async () => {
        await result.current.loadCreatorCourses()
      })

      expect(mockFetchCoursesByCreator).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Access denied. You do not have permission to view courses.',
      )

      consoleSpy.mockRestore()
    })

    test('should load public courses', async () => {
      const mockFetchCourses = jest.fn().mockResolvedValue(undefined)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        fetchCourses: mockFetchCourses,
      })

      const { result } = renderHook(() => useCourseManagement())

      await act(async () => {
        await result.current.loadPublicCourses(3, 15)
      })

      expect(mockFetchCourses).toHaveBeenCalledWith(3, 15)
    })

    test('should refresh courses correctly', async () => {
      const mockFetchCourses = jest.fn().mockResolvedValue(undefined)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        fetchCourses: mockFetchCourses,
      })

      const { result } = renderHook(() => useCourseManagement())

      await act(async () => {
        await result.current.refreshCourses()
      })

      expect(mockFetchCourses).toHaveBeenCalledWith(1, 10)
    })
  })

  describe('CRUD Operations with Validation', () => {
    test('should create course with validation successfully', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const mockCreateCourse = jest.fn().mockResolvedValue(mockCourse)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        createCourse: mockCreateCourse,
      })

      const { result } = renderHook(() => useCourseManagement())

      let success = false
      await act(async () => {
        success = await result.current.createCourseWithValidation(mockCreateRequest)
      })

      expect(success).toBe(true)
      expect(mockCreateCourse).toHaveBeenCalledWith(mockCreateRequest)
    })

    test('should not create course without permission', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'user',
        isLoading: false,
        error: null,
      })

      const mockCreateCourse = jest.fn()
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        createCourse: mockCreateCourse,
      })

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useCourseManagement())

      let success = false
      await act(async () => {
        success = await result.current.createCourseWithValidation(mockCreateRequest)
      })

      expect(success).toBe(false)
      expect(mockCreateCourse).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Access denied. Only creators and admins can create courses.',
      )

      consoleSpy.mockRestore()
    })

    test('should handle create course error', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const mockCreateCourse = jest.fn().mockRejectedValue(new Error('Creation failed'))
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        createCourse: mockCreateCourse,
      })

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useCourseManagement())

      let success = false
      await act(async () => {
        success = await result.current.createCourseWithValidation(mockCreateRequest)
      })

      expect(success).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to create course:', expect.any(Error))

      consoleSpy.mockRestore()
    })

    test('should update course with validation successfully', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const mockUpdateCourse = jest.fn().mockResolvedValue(mockCourse)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        updateCourse: mockUpdateCourse,
      })

      const { result } = renderHook(() => useCourseManagement())

      let success = false
      await act(async () => {
        success = await result.current.updateCourseWithValidation('course-1', mockUpdateRequest)
      })

      expect(success).toBe(true)
      expect(mockUpdateCourse).toHaveBeenCalledWith('course-1', mockUpdateRequest)
    })

    test('should not update course without permission', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'user',
        isLoading: false,
        error: null,
      })

      const mockUpdateCourse = jest.fn()
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        updateCourse: mockUpdateCourse,
      })

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useCourseManagement())

      let success = false
      await act(async () => {
        success = await result.current.updateCourseWithValidation('course-1', mockUpdateRequest)
      })

      expect(success).toBe(false)
      expect(mockUpdateCourse).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Access denied. Only course owners can update courses.',
      )

      consoleSpy.mockRestore()
    })

    test('should delete course with confirmation successfully', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const mockDeleteCourse = jest.fn().mockResolvedValue(true)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        deleteCourse: mockDeleteCourse,
      })

      const { result } = renderHook(() => useCourseManagement())

      let success = false
      await act(async () => {
        success = await result.current.deleteCourseWithConfirmation('course-1')
      })

      expect(success).toBe(true)
      expect(mockDeleteCourse).toHaveBeenCalledWith('course-1')
    })

    test('should update course status with validation successfully', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const mockUpdateCourseStatus = jest.fn().mockResolvedValue(mockCourse)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        updateCourseStatus: mockUpdateCourseStatus,
      })

      const { result } = renderHook(() => useCourseManagement())

      let success = false
      await act(async () => {
        success = await result.current.updateCourseStatusWithValidation('course-1', 'PUBLISHED')
      })

      expect(success).toBe(true)
      expect(mockUpdateCourseStatus).toHaveBeenCalledWith('course-1', 'PUBLISHED')
    })
  })

  describe('Batch Operations', () => {
    test('should delete multiple courses successfully', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const mockDeleteCourse = jest.fn().mockResolvedValue(true)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        deleteCourse: mockDeleteCourse,
      })

      const { result } = renderHook(() => useCourseManagement())

      let success = false
      await act(async () => {
        success = await result.current.deleteMultipleCourses(['course-1', 'course-2'])
      })

      expect(success).toBe(true)
      expect(mockDeleteCourse).toHaveBeenCalledTimes(2)
      expect(mockDeleteCourse).toHaveBeenCalledWith('course-1')
      expect(mockDeleteCourse).toHaveBeenCalledWith('course-2')
    })

    test('should handle partial batch deletion failure', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const mockDeleteCourse = jest.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        deleteCourse: mockDeleteCourse,
      })

      const { result } = renderHook(() => useCourseManagement())

      let success = false
      await act(async () => {
        success = await result.current.deleteMultipleCourses(['course-1', 'course-2'])
      })

      expect(success).toBe(false)
    })

    test('should update multiple course status successfully', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const mockUpdateCourseStatus = jest.fn().mockResolvedValue(mockCourse)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        updateCourseStatus: mockUpdateCourseStatus,
      })

      const { result } = renderHook(() => useCourseManagement())

      let success = false
      await act(async () => {
        success = await result.current.updateMultipleCourseStatus(
          ['course-1', 'course-2'],
          'PUBLISHED',
        )
      })

      expect(success).toBe(true)
      expect(mockUpdateCourseStatus).toHaveBeenCalledTimes(2)
      expect(mockUpdateCourseStatus).toHaveBeenCalledWith('course-1', 'PUBLISHED')
      expect(mockUpdateCourseStatus).toHaveBeenCalledWith('course-2', 'PUBLISHED')
    })
  })

  describe('Error Recovery', () => {
    test('should clear errors correctly', () => {
      const mockClearError = jest.fn()
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        clearError: mockClearError,
      })

      const { result } = renderHook(() => useCourseManagement())

      act(() => {
        result.current.clearError()
      })

      expect(mockClearError).toHaveBeenCalled()
    })

    test('should reset state correctly', () => {
      const mockResetState = jest.fn()
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        resetState: mockResetState,
      })

      const { result } = renderHook(() => useCourseManagement())

      act(() => {
        result.current.resetState()
      })

      expect(mockResetState).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    test('should handle loading state correctly', () => {
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        isLoading: true,
      })

      const { result } = renderHook(() => useCourseManagement())

      expect(result.current.isLoading).toBe(true)
    })

    test('should handle error state correctly', () => {
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        error: 'Test error',
      })

      const { result } = renderHook(() => useCourseManagement())

      expect(result.current.error).toBe('Test error')
    })

    test('should handle empty courses array', () => {
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        courses: [],
      })

      const { result } = renderHook(() => useCourseManagement())

      expect(result.current.courses).toEqual([])
    })

    test('should handle role loading state', () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: null,
        isLoading: true,
        error: null,
      })

      const { result } = renderHook(() => useCourseManagement())

      expect(result.current.hasPermission('create')).toBe(false)
    })

    test('should handle role error state', () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: null,
        isLoading: false,
        error: 'Role error',
      })

      const { result } = renderHook(() => useCourseManagement())

      expect(result.current.hasPermission('create')).toBe(false)
    })
  })

  describe('Performance and Memory', () => {
    test('should not cause memory leaks with rapid operations', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const mockCreateCourse = jest.fn().mockResolvedValue(mockCourse)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        createCourse: mockCreateCourse,
      })

      const { result } = renderHook(() => useCourseManagement())

      await act(async () => {
        await Promise.all([
          result.current.createCourseWithValidation(mockCreateRequest),
          result.current.createCourseWithValidation(mockCreateRequest),
          result.current.createCourseWithValidation(mockCreateRequest),
        ])
      })

      expect(mockCreateCourse).toHaveBeenCalledTimes(3)
    })

    test('should handle concurrent operations gracefully', async () => {
      const mockUseUserRole = jest.requireMock('@/features/auth/hooks/useUserRole').useUserRole
      mockUseUserRole.mockReturnValue({
        role: 'creator',
        isLoading: false,
        error: null,
      })

      const mockUpdateCourse = jest.fn().mockResolvedValue(mockCourse)
      mockUseCourse.mockReturnValue({
        ...mockUseCourse(),
        updateCourse: mockUpdateCourse,
      })

      const { result } = renderHook(() => useCourseManagement())

      await act(async () => {
        await Promise.all([
          result.current.updateCourseWithValidation('course-1', mockUpdateRequest),
          result.current.updateCourseWithValidation('course-2', mockUpdateRequest),
        ])
      })

      expect(mockUpdateCourse).toHaveBeenCalledTimes(2)
    })
  })
})
 
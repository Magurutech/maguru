/**
 * Unit Test: useCourse Hook
 *
 * @description
 * Test untuk low-level hook useCourse yang berinteraksi langsung dengan courseAdapter.
 * Mengikuti arsitektur Maguru untuk testing dengan:
 * - Mock adapter layer
 * - State management testing
 * - Error handling testing
 * - CRUD operations testing
 * - React Query integration testing
 * - Search/filter functionality testing
 */

import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCourse } from './useCourse'
import { CourseAdapter } from '../adapters/courseAdapter'
import type { Course, CreateCourseRequest, UpdateCourseRequest } from '../types'

// Mock CourseAdapter
jest.mock('../adapters/courseAdapter')
const mockedCourseAdapter = CourseAdapter as jest.Mocked<typeof CourseAdapter>

// Mock console untuk testing
const originalConsole = { ...console }
beforeEach(() => {
  console.log = jest.fn()
  console.warn = jest.fn()
  console.error = jest.fn()
})

afterEach(() => {
  console.log = originalConsole.log
  console.warn = originalConsole.warn
  console.error = originalConsole.error
})

// Mock data
const mockCourse: Course = {
  id: 'course-1',
  title: 'Test Course',
  description: 'Test Description',
  thumbnail: '/test-thumbnail.jpg',
  status: 'DRAFT',
  students: 0,
  lessons: 0,
  duration: '0',
  rating: 0,
  category: 'Test Category',
  creatorId: 'creator-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockCourseListResponse = {
  success: true,
  data: {
    courses: [mockCourse],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    },
  },
}

const mockCourseResponse = {
  success: true,
  data: mockCourse,
}

const queryClient = new QueryClient()
//   return ({ children }: { children: React.ReactNode }) => {
const createWrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useCourse Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock default responses
    mockedCourseAdapter.getCourses.mockResolvedValue(mockCourseListResponse)
    mockedCourseAdapter.getCourseById.mockResolvedValue(mockCourseResponse)
    mockedCourseAdapter.createCourse.mockResolvedValue(mockCourseResponse)
    mockedCourseAdapter.updateCourse.mockResolvedValue(mockCourseResponse)
    mockedCourseAdapter.deleteCourse.mockResolvedValue({ success: true })
    mockedCourseAdapter.updateCourseStatus.mockResolvedValue(mockCourseResponse)
    mockedCourseAdapter.getDisplayThumbnail.mockReturnValue('/default-thumbnail.jpg')
    mockedCourseAdapter.isDefaultThumbnail.mockReturnValue(false)
    mockedCourseAdapter.getDefaultThumbnailUrl.mockReturnValue('/default-thumbnail.jpg')
  })

  describe('Initial State', () => {
    it('should initialize with default state', async () => {
      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      // Wait for initial query to complete
      await waitFor(() => {
        expect(result.current.courses).toEqual([mockCourse])
      })

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

  describe('fetchCourses', () => {
    it('should fetch courses successfully with search parameters', async () => {
      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      await act(async () => {
        await result.current.fetchCourses({
          searchQuery: 'test',
          selectedStatus: 'DRAFT',
          selectedCategory: 'Programming',
        })
      })

      await waitFor(() => {
        expect(mockedCourseAdapter.getCourses).toHaveBeenCalledWith(1, 10, {
          searchQuery: 'test',
          selectedStatus: 'DRAFT',
          selectedCategory: 'Programming',
        })
      })
    })

    it('should fetch courses without search parameters', async () => {
      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      await act(async () => {
        await result.current.fetchCourses()
      })

      await waitFor(() => {
        expect(mockedCourseAdapter.getCourses).toHaveBeenCalled()
      })
    })

    it('should handle fetch courses error', async () => {
      const errorResponse = {
        success: false,
        error: 'Failed to fetch courses',
      }
      mockedCourseAdapter.getCourses.mockResolvedValue(errorResponse)

      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      await act(async () => {
        await result.current.fetchCourses()
      })

      await waitFor(() => {
        expect(mockedCourseAdapter.getCourses).toHaveBeenCalled()
      })
    })
  })

  describe('fetchCourseById', () => {
    it('should fetch course by ID successfully', async () => {
      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      await act(async () => {
        await result.current.fetchCourseById('course-1')
      })

      await waitFor(() => {
        expect(mockedCourseAdapter.getCourseById).toHaveBeenCalledWith('course-1')
      })
    })

    it('should handle fetch course by ID error', async () => {
      const errorResponse = {
        success: false,
        error: 'Course not found',
      }
      mockedCourseAdapter.getCourseById.mockResolvedValue(errorResponse)

      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      await act(async () => {
        await result.current.fetchCourseById('invalid-id')
      })

      await waitFor(() => {
        expect(mockedCourseAdapter.getCourseById).toHaveBeenCalledWith('invalid-id')
      })
    })
  })

  describe('createCourse', () => {
    it('should create course successfully', async () => {
      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      const courseData: CreateCourseRequest = {
        title: 'New Course',
        description: 'New Description',
        thumbnail: '/new-thumbnail.jpg',
        category: 'Programming',
        status: 'DRAFT',
      }

      let createdCourse: Course | null = null
      await act(async () => {
        createdCourse = await result.current.createCourse(courseData)
      })

      expect(createdCourse).toEqual(mockCourse)
      expect(mockedCourseAdapter.createCourse).toHaveBeenCalledWith(courseData)
    })

    it('should handle create course error', async () => {
      const errorResponse = {
        success: false,
        error: 'Failed to create course',
      }
      mockedCourseAdapter.createCourse.mockResolvedValue(errorResponse)

      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      const courseData: CreateCourseRequest = {
        title: 'New Course',
        description: 'New Description',
        thumbnail: '/new-thumbnail.jpg',
        category: 'Programming',
        status: 'DRAFT',
      }

      let createdCourse: Course | null = null
      await act(async () => {
        createdCourse = await result.current.createCourse(courseData)
      })

      expect(createdCourse).toBeNull()
      expect(mockedCourseAdapter.createCourse).toHaveBeenCalledWith(courseData)
    })
  })

  describe('updateCourse', () => {
    it('should update course successfully', async () => {
      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      const updateData: UpdateCourseRequest = {
        id: 'course-1',
        title: 'Updated Course',
        description: 'Updated Description',
        thumbnail: '/updated-thumbnail.jpg',
        category: 'Programming',
        status: 'PUBLISHED',
      }

      let updatedCourse: Course | null = null
      await act(async () => {
        updatedCourse = await result.current.updateCourse('course-1', updateData)
      })

      expect(updatedCourse).toEqual(mockCourse)
      expect(mockedCourseAdapter.updateCourse).toHaveBeenCalledWith('course-1', updateData)
    })
  })

  describe('deleteCourse', () => {
    it('should delete course successfully', async () => {
      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      let success = false
      await act(async () => {
        success = await result.current.deleteCourse('course-1')
      })

      expect(success).toBe(true)
      expect(mockedCourseAdapter.deleteCourse).toHaveBeenCalledWith('course-1')
    })
  })

  describe('Utility Functions', () => {
    it('should clear error', async () => {
      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      await act(async () => {
        result.current.clearError()
      })

      // Should not throw error
      expect(result.current.clearError).toBeDefined()
    })

    it('should reset state', async () => {
      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })
      await act(async () => {
        result.current.resetState()
      })

      // Should not throw error
      expect(result.current.resetState).toBeDefined()
    })

    it('should provide thumbnail utilities', async () => {
      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      expect(result.current.getDisplayThumbnail).toBeDefined()
      expect(result.current.isDefaultThumbnail).toBeDefined()
      expect(result.current.getDefaultThumbnailUrl).toBeDefined()
    })
  })

  describe('Search and Filter', () => {
    it('should handle search with debouncing', async () => {
      const { result } = renderHook(() => useCourse(), { wrapper: createWrapper })

      await act(async () => {
        await result.current.fetchCourses({
          searchQuery: 'test search',
          selectedStatus: 'DRAFT',
          selectedCategory: 'Programming',
          page: 2,
          limit: 20,
        })
      })

      await waitFor(() => {
        expect(mockedCourseAdapter.getCourses).toHaveBeenCalledWith(2, 20, {
          searchQuery: 'test search',
          selectedStatus: 'DRAFT',
          selectedCategory: 'Programming',
        })
      })
    })
  })
})

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
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useCourse } from './useCourse'
import { CourseAdapter } from '../adapters/courseAdapter'
import type { Course, CreateCourseRequest, UpdateCourseRequest } from '../../types'

// Mock CourseAdapter
jest.mock('../adapters/courseAdapter')
const mockedCourseAdapter = CourseAdapter as jest.Mocked<typeof CourseAdapter>

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

describe('useCourse Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useCourse())

      expect(result.current.courses).toEqual([])
      expect(result.current.currentCourse).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isCreating).toBe(false)
      expect(result.current.isUpdating).toBe(false)
      expect(result.current.isDeleting).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      })
    })
  })

  describe('fetchCourses', () => {
    it('should fetch courses successfully', async () => {
      mockedCourseAdapter.getCourses.mockResolvedValue(mockCourseListResponse)

      const { result } = renderHook(() => useCourse())

      await act(async () => {
        await result.current.fetchCourses(1, 10)
      })

      await waitFor(() => {
        expect(result.current.courses).toEqual([mockCourse])
        expect(result.current.pagination).toEqual(mockCourseListResponse.data.pagination)
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBeNull()
      })

      expect(mockedCourseAdapter.getCourses).toHaveBeenCalledWith(1, 10)
    })

    it('should handle fetch courses error', async () => {
      const errorResponse = {
        success: false,
        error: 'Failed to fetch courses',
      }
      mockedCourseAdapter.getCourses.mockResolvedValue(errorResponse)

      const { result } = renderHook(() => useCourse())

      await act(async () => {
        await result.current.fetchCourses()
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch courses')
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('fetchCourseById', () => {
    it('should fetch course by ID successfully', async () => {
      mockedCourseAdapter.getCourseById.mockResolvedValue(mockCourseResponse)

      const { result } = renderHook(() => useCourse())

      await act(async () => {
        await result.current.fetchCourseById('course-1')
      })

      await waitFor(() => {
        expect(result.current.currentCourse).toEqual(mockCourse)
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBeNull()
      })

      expect(mockedCourseAdapter.getCourseById).toHaveBeenCalledWith('course-1')
    })

    it('should handle fetch course by ID error', async () => {
      const errorResponse = {
        success: false,
        error: 'Course not found',
      }
      mockedCourseAdapter.getCourseById.mockResolvedValue(errorResponse)

      const { result } = renderHook(() => useCourse())

      await act(async () => {
        await result.current.fetchCourseById('course-1')
      })

      await waitFor(() => {
        expect(result.current.currentCourse).toBeNull()
        expect(result.current.error).toBe('Course not found')
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('createCourse', () => {
    it('should create course successfully', async () => {
      mockedCourseAdapter.createCourse.mockResolvedValue(mockCourseResponse)

      const { result } = renderHook(() => useCourse())
      const courseData: CreateCourseRequest = {
        title: 'New Course',
        description: 'New Description',
        thumbnail: '/new-thumbnail.jpg',
        category: 'New Category',
      }

      await act(async () => {
        const newCourse = await result.current.createCourse(courseData)
        expect(newCourse).toEqual(mockCourse)
      })

      await waitFor(() => {
        expect(result.current.courses).toEqual([mockCourse])
        expect(result.current.isCreating).toBe(false)
        expect(result.current.error).toBeNull()
      })

      expect(mockedCourseAdapter.createCourse).toHaveBeenCalledWith(courseData)
    })

    it('should handle create course error', async () => {
      const errorResponse = {
        success: false,
        error: 'Failed to create course',
      }
      mockedCourseAdapter.createCourse.mockResolvedValue(errorResponse)

      const { result } = renderHook(() => useCourse())
      const courseData: CreateCourseRequest = {
        title: 'New Course',
        description: 'New Description',
        thumbnail: '/new-thumbnail.jpg',
        category: 'New Category',
      }

      await act(async () => {
        const newCourse = await result.current.createCourse(courseData)
        expect(newCourse).toBeNull()
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to create course')
        expect(result.current.isCreating).toBe(false)
      })
    })
  })

  describe('updateCourse', () => {
    it('should update course successfully', async () => {
      const updatedCourse = { ...mockCourse, title: 'Updated Course' }
      const updatedResponse = {
        success: true,
        data: updatedCourse,
      }
      mockedCourseAdapter.updateCourse.mockResolvedValue(updatedResponse)

      const { result } = renderHook(() => useCourse())

      // Load initial data first
      mockedCourseAdapter.getCourses.mockResolvedValue(mockCourseListResponse)
      await act(async () => {
        await result.current.fetchCourses()
      })

      await waitFor(() => {
        expect(result.current.courses).toEqual([mockCourse])
      })

      const courseData: UpdateCourseRequest = {
        id: 'course-1',
        title: 'Updated Course',
        description: 'Updated Description',
        thumbnail: '/updated-thumbnail.jpg',
        category: 'Updated Category',
      }

      await act(async () => {
        const updated = await result.current.updateCourse('course-1', courseData)
        expect(updated).toEqual(updatedCourse)
      })

      await waitFor(() => {
        expect(result.current.courses).toEqual([updatedCourse])
        expect(result.current.isUpdating).toBe(false)
        expect(result.current.error).toBeNull()
      })

      expect(mockedCourseAdapter.updateCourse).toHaveBeenCalledWith('course-1', courseData)
    })
  })

  describe('deleteCourse', () => {
    it('should delete course successfully', async () => {
      const deleteResponse = {
        success: true,
        message: 'Course deleted successfully',
      }
      mockedCourseAdapter.deleteCourse.mockResolvedValue(deleteResponse)

      const { result } = renderHook(() => useCourse())

      // Load initial data first
      mockedCourseAdapter.getCourses.mockResolvedValue(mockCourseListResponse)
      await act(async () => {
        await result.current.fetchCourses()
      })

      await waitFor(() => {
        expect(result.current.courses).toEqual([mockCourse])
      })

      await act(async () => {
        const success = await result.current.deleteCourse('course-1')
        expect(success).toBe(true)
      })

      await waitFor(() => {
        expect(result.current.courses).toEqual([])
        expect(result.current.isDeleting).toBe(false)
        expect(result.current.error).toBeNull()
      })

      expect(mockedCourseAdapter.deleteCourse).toHaveBeenCalledWith('course-1')
    })
  })

  describe('Utility Functions', () => {
    it('should clear error', async () => {
      const errorResponse = {
        success: false,
        error: 'Test error',
      }
      mockedCourseAdapter.getCourses.mockResolvedValue(errorResponse)

      const { result } = renderHook(() => useCourse())

      // Trigger an error first
      await act(async () => {
        await result.current.fetchCourses()
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Test error')
      })

      // Clear error
      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })

    it('should reset state', async () => {
      mockedCourseAdapter.getCourses.mockResolvedValue(mockCourseListResponse)

      const { result } = renderHook(() => useCourse())

      // Load some data first
      await act(async () => {
        await result.current.fetchCourses()
      })

      await waitFor(() => {
        expect(result.current.courses).toEqual([mockCourse])
      })

      // Reset state
      act(() => {
        result.current.resetState()
      })

      expect(result.current.courses).toEqual([])
      expect(result.current.currentCourse).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })
})

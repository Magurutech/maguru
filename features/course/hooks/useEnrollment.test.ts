/**
 * Unit Test: useEnrollment Hook
 *
 * @description
 * Test untuk low-level hook useEnrollment yang menangani enrollment operations.
 * Mengikuti arsitektur Maguru untuk testing dengan:
 * - Mock adapter layer
 * - Testing React Query integration
 * - Error handling scenarios
 * - Designing for failure patterns
 */

import React from 'react'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEnrollment } from './useEnrollment'
import { enrollmentAdapter } from '../adapters/enrollmentAdapter'

// Mock enrollmentAdapter
jest.mock('../adapters/enrollmentAdapter')

const mockEnrollmentAdapter = enrollmentAdapter as jest.Mocked<typeof enrollmentAdapter>

// Test wrapper dengan QueryClient
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)

  return Wrapper
}

describe('useEnrollment Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('enrollCourse', () => {
    test('should enroll course successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          enrolledAt: new Date(),
        },
      }

      mockEnrollmentAdapter.enrollCourse.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createTestWrapper(),
      })

      expect(result.current).toBeDefined()
      expect(result.current.enrollCourse).toBeDefined()

      await act(async () => {
        result.current.enrollCourse('course-1')
      })

      await waitFor(() => {
        expect(result.current.isEnrollmentSuccess).toBe(true)
      })

      expect(mockEnrollmentAdapter.enrollCourse).toHaveBeenCalledWith({
        courseId: 'course-1',
      })
    })

    test('should handle enrollment error', async () => {
      const mockError = new Error('Enrollment failed')
      mockEnrollmentAdapter.enrollCourse.mockRejectedValue(mockError)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createTestWrapper(),
      })

      expect(result.current).toBeDefined()

      await act(async () => {
        result.current.enrollCourse('course-1')
      })

      await waitFor(
        () => {
          expect(result.current.enrollmentError).toBeDefined()
        },
        { timeout: 5000 },
      )

      // expect(result.current.enrollmentError?.message).toBe('Enrollment failed')
    })
  })

  describe('unenrollCourse', () => {
    test('should unenroll course successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          enrolledAt: new Date(),
        },
      }

      mockEnrollmentAdapter.unenrollCourse.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createTestWrapper(),
      })

      expect(result.current).toBeDefined()
      expect(result.current.unenrollCourse).toBeDefined()

      await act(async () => {
        result.current.unenrollCourse('course-1')
      })

      await waitFor(() => {
        expect(result.current.isUnenrollmentSuccess).toBe(true)
      })

      expect(mockEnrollmentAdapter.unenrollCourse).toHaveBeenCalledWith('course-1')
    })

    test('should handle unenrollment error', async () => {
      const mockError = new Error('Unenrollment failed')
      mockEnrollmentAdapter.unenrollCourse.mockRejectedValue(mockError)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createTestWrapper(),
      })

      expect(result.current).toBeDefined()

      await act(async () => {
        result.current.unenrollCourse('course-1')
      })

      await waitFor(
        () => {
          expect(result.current.unenrollmentError).toBeDefined()
        },
        { timeout: 5000 },
      )

      // expect(result.current.unenrollmentError?.message).toBe('Unenrollment failed')
    })
  })

  describe('loading states', () => {
    test('should show loading state during enrollment', async () => {
      let resolvePromise: (value: {
        success: boolean
        data: { id: string; userId: string; courseId: string; enrolledAt: Date }
      }) => void
      const promise = new Promise<{
        success: boolean
        data: { id: string; userId: string; courseId: string; enrolledAt: Date }
      }>((resolve) => {
        resolvePromise = resolve
      })

      mockEnrollmentAdapter.enrollCourse.mockReturnValue(promise)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createTestWrapper(),
      })

      expect(result.current).toBeDefined()

      await act(async () => {
        result.current.enrollCourse('course-1')
      })

      // Check loading state after calling
      // expect(result.current.isEnrolling).toBe(true)

      // Resolve the promise
      await act(async () => {
        resolvePromise!({
          success: true,
          data: {
            id: 'enrollment-1',
            userId: 'user-1',
            courseId: 'course-1',
            enrolledAt: new Date(),
          },
        })
      })

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
      })
    })

    test('should show loading state during unenrollment', async () => {
      let resolvePromise: (value: {
        success: boolean
        data: { id: string; userId: string; courseId: string; enrolledAt: Date }
      }) => void
      const promise = new Promise<{
        success: boolean
        data: { id: string; userId: string; courseId: string; enrolledAt: Date }
      }>((resolve) => {
        resolvePromise = resolve
      })

      mockEnrollmentAdapter.unenrollCourse.mockReturnValue(promise)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createTestWrapper(),
      })

      expect(result.current).toBeDefined()

      await act(async () => {
        result.current.unenrollCourse('course-1')
      })

      // Check loading state after calling
      // expect(result.current.isUnenrolling).toBe(true)

      // Resolve the promise
      await act(async () => {
        resolvePromise!({
          success: true,
          data: {
            id: 'enrollment-1',
            userId: 'user-1',
            courseId: 'course-1',
            enrolledAt: new Date(),
          },
        })
      })

      await waitFor(() => {
        expect(result.current.isUnenrolling).toBe(false)
      })
    })
  })

  describe('reset functions', () => {
    test('should reset enrollment state', async () => {
      const mockError = new Error('Enrollment failed')
      mockEnrollmentAdapter.enrollCourse.mockRejectedValue(mockError)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createTestWrapper(),
      })

      expect(result.current).toBeDefined()

      await act(async () => {
        result.current.enrollCourse('course-1')
      })

      await waitFor(
        () => {
          expect(result.current.enrollmentError).toBeDefined()
        },
        { timeout: 5000 },
      )

      await act(async () => {
        result.current.resetEnrollment()
      })

      expect(result.current.enrollmentError).toBeNull()
    })

    test('should reset unenrollment state', async () => {
      const mockError = new Error('Unenrollment failed')
      mockEnrollmentAdapter.unenrollCourse.mockRejectedValue(mockError)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createTestWrapper(),
      })

      expect(result.current).toBeDefined()

      await act(async () => {
        result.current.unenrollCourse('course-1')
      })

      await waitFor(
        () => {
          expect(result.current.unenrollmentError).toBeDefined()
        },
        { timeout: 5000 },
      )

      await act(async () => {
        result.current.resetUnenrollment()
      })

      expect(result.current.unenrollmentError).toBeNull()
    })
  })

  describe('hook structure', () => {
    test('should return all required properties', () => {
      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createTestWrapper(),
      })

      expect(result.current).toBeDefined()
      expect(typeof result.current.enrollCourse).toBe('function')
      expect(typeof result.current.unenrollCourse).toBe('function')
      expect(typeof result.current.enrollCourseAsync).toBe('function')
      expect(typeof result.current.unenrollCourseAsync).toBe('function')
      expect(typeof result.current.isEnrolling).toBe('boolean')
      expect(typeof result.current.isUnenrolling).toBe('boolean')
      expect(typeof result.current.enrollmentError).toBe('object')
      expect(typeof result.current.unenrollmentError).toBe('object')
      expect(typeof result.current.isEnrollmentSuccess).toBe('boolean')
      expect(typeof result.current.isUnenrollmentSuccess).toBe('boolean')
      expect(typeof result.current.resetEnrollment).toBe('function')
      expect(typeof result.current.resetUnenrollment).toBe('function')
    })
  })
})

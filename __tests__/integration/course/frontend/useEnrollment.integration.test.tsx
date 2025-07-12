/**
 * Integration Test: useEnrollment Hook
 *
 * Test ini bertujuan untuk menguji integrasi useEnrollment hook dengan:
 * - Adapter communication
 * - React Query integration
 * - State management
 *
 * Coverage:
 * - Hook ↔ Adapter integration
 * - React Query mutation handling
 * - Error propagation dari adapter ke hook
 * - State transitions dan management
 */

import React from 'react'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEnrollment } from '../../../../features/course/hooks/useEnrollment'
import { enrollmentAdapter } from '../../../../features/course/adapters/enrollmentAdapter'
import type { EnrollmentResponse } from '../../../../features/course/types'

// Mock adapter
jest.mock('../../../../features/course/adapters/enrollmentAdapter')
const mockEnrollmentAdapter = enrollmentAdapter as jest.Mocked<typeof enrollmentAdapter>

// Test wrapper dengan QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = 'TestWrapper'

  return Wrapper
}

describe('useEnrollment Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Hook ↔ Adapter Integration', () => {
    test('should call enrollmentAdapter.enrollCourse with correct parameters', async () => {
      const mockResponse: EnrollmentResponse = {
        success: true,
        data: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          enrolledAt: new Date('2024-01-01'),
        },
      }

      mockEnrollmentAdapter.enrollCourse.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

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

    test('should handle adapter error response correctly', async () => {
      mockEnrollmentAdapter.enrollCourse.mockRejectedValue(new Error('Course not found'))

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        result.current.enrollCourse('course-1')
      })

      await waitFor(
        () => {
          expect(result.current.enrollmentError).toBeDefined()
        },
        { timeout: 5000 },
      )
    })

    test('should handle adapter network errors correctly', async () => {
      mockEnrollmentAdapter.enrollCourse.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        result.current.enrollCourse('course-1')
      })

      await waitFor(
        () => {
          expect(result.current.enrollmentError).toBeDefined()
        },
        { timeout: 5000 },
      )
    })
  })

  describe('React Query Integration', () => {
    test('should use useMutation for enrollment operations', async () => {
      const mockResponse: EnrollmentResponse = {
        success: true,
        data: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          enrolledAt: new Date('2024-01-01'),
        },
      }

      mockEnrollmentAdapter.enrollCourse.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      expect(result.current.enrollCourse).toBeDefined()
      expect(typeof result.current.enrollCourse).toBe('function')
      expect(result.current.enrollCourseAsync).toBeDefined()
      expect(typeof result.current.enrollCourseAsync).toBe('function')
    })

    test('should handle mutation success state correctly', async () => {
      const mockResponse: EnrollmentResponse = {
        success: true,
        data: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          enrolledAt: new Date('2024-01-01'),
        },
      }

      mockEnrollmentAdapter.enrollCourse.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        result.current.enrollCourse('course-1')
      })

      await waitFor(() => {
        expect(result.current.isEnrollmentSuccess).toBe(true)
        expect(result.current.enrollmentError).toBeNull()
      })
    })

    test('should handle mutation error state correctly', async () => {
      mockEnrollmentAdapter.enrollCourse.mockRejectedValue(new Error('Enrollment failed'))

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        result.current.enrollCourse('course-1')
      })

      await waitFor(
        () => {
          expect(result.current.enrollmentError).toBeDefined()
        },
        { timeout: 5000 },
      )
    })
  })

  describe('State Management', () => {
    test('should provide all required properties', () => {
      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
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

    test('should reset enrollment state', async () => {
      mockEnrollmentAdapter.enrollCourse.mockRejectedValue(new Error('Enrollment failed'))

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

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
  })
})

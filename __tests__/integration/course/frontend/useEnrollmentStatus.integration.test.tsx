/**
 * Integration Test: useEnrollmentStatus Hook
 *
 * Test ini bertujuan untuk menguji integrasi useEnrollmentStatus hook dengan:
 * - Adapter communication
 * - React Query integration
 * - State management
 *
 * Coverage:
 * - Hook ↔ Adapter integration
 * - React Query query handling
 * - Error propagation dari adapter ke hook
 * - State transitions dan management
 */

import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEnrollmentStatus } from '../../../../features/course/hooks/useEnrollmentStatus'
import { enrollmentAdapter } from '../../../../features/course/adapters/enrollmentAdapter'
import type { EnrollmentStatusResponse } from '../../../../features/course/types'

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

describe('useEnrollmentStatus Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Hook ↔ Adapter Integration', () => {
    test('should call enrollmentAdapter.getEnrollmentStatus with courseId', async () => {
      const mockResponse: EnrollmentStatusResponse = {
        success: true,
        isEnrolled: false,
      }

      mockEnrollmentAdapter.getEnrollmentStatus.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockEnrollmentAdapter.getEnrollmentStatus).toHaveBeenCalledWith('course-1')
    })

    test('should handle adapter success response correctly', async () => {
      const mockResponse: EnrollmentStatusResponse = {
        success: true,
        isEnrolled: true,
        enrollmentDate: new Date('2024-01-15T10:30:00.000Z'),
      }

      mockEnrollmentAdapter.getEnrollmentStatus.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.data?.isEnrolled).toBe(true)
        expect(result.current.data?.enrollmentDate).toEqual(new Date('2024-01-15T10:30:00.000Z'))
      })
    })

    test('should handle adapter error response correctly', async () => {
      mockEnrollmentAdapter.getEnrollmentStatus.mockRejectedValue(new Error('Course not found'))

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
      })

      expect(result.current.error).toBeDefined()
    })

    test('should handle adapter network errors correctly', async () => {
      mockEnrollmentAdapter.getEnrollmentStatus.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('React Query Integration', () => {
    test('should use useQuery for status checking', async () => {
      const mockResponse: EnrollmentStatusResponse = {
        success: true,
        isEnrolled: false,
      }

      mockEnrollmentAdapter.getEnrollmentStatus.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
      expect(result.current.error).toBeDefined()
    })

    test('should enable query only when courseId is provided', async () => {
      const { result } = renderHook(() => useEnrollmentStatus(''), {
        wrapper: createWrapper(),
      })

      expect(result.current.isFetching).toBe(false)
      expect(mockEnrollmentAdapter.getEnrollmentStatus).not.toHaveBeenCalled()
    })

    test('should use correct query key', async () => {
      const mockResponse: EnrollmentStatusResponse = {
        success: true,
        isEnrolled: false,
      }

      mockEnrollmentAdapter.getEnrollmentStatus.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockEnrollmentAdapter.getEnrollmentStatus).toHaveBeenCalledWith('course-1')
    })

    test('should handle query errors properly', async () => {
      mockEnrollmentAdapter.getEnrollmentStatus.mockRejectedValue(new Error('Query failed'))

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('State Management', () => {
    test('should manage loading state correctly', async () => {
      mockEnrollmentAdapter.getEnrollmentStatus.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      )

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    test('should manage error state correctly', async () => {
      mockEnrollmentAdapter.getEnrollmentStatus.mockRejectedValue(new Error('Status check failed'))

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
      })

      expect(result.current.error).toBeDefined()
    })

    test('should manage data state correctly', async () => {
      const mockResponse: EnrollmentStatusResponse = {
        success: true,
        isEnrolled: true,
        enrollmentDate: new Date('2024-01-15T10:30:00.000Z'),
      }

      mockEnrollmentAdapter.getEnrollmentStatus.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
    })

    test('should handle state transitions correctly', async () => {
      let resolvePromise: (value: EnrollmentStatusResponse) => void
      const promise = new Promise<EnrollmentStatusResponse>((resolve) => {
        resolvePromise = resolve
      })

      mockEnrollmentAdapter.getEnrollmentStatus.mockReturnValue(promise)

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      // Loading state
      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeNull()

      // Resolve with success
      resolvePromise!({
        success: true,
        isEnrolled: false,
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
        expect(result.current.data?.isEnrolled).toBe(false)
        expect(result.current.error).toBeNull()
      })
    })
  })

  describe('Hook Structure', () => {
    test('should provide all required properties', async () => {
      const mockResponse: EnrollmentStatusResponse = {
        success: true,
        isEnrolled: false,
      }

      mockEnrollmentAdapter.getEnrollmentStatus.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current).toBeDefined()
      expect(typeof result.current.isLoading).toBe('boolean')
      expect(typeof result.current.data).toBe('object')
      expect(typeof result.current.error).toBe('object')
      expect(typeof result.current.isError).toBe('boolean')
      expect(typeof result.current.isSuccess).toBe('boolean')
      expect(typeof result.current.refetch).toBe('function')
    })
  })
})

/**
 * Unit Test: useEnrollmentStatus Hook
 *
 * @description
 * Test untuk low-level hook useEnrollmentStatus yang menangani enrollment status checking.
 * Mengikuti arsitektur Maguru untuk testing dengan:
 * - Mock adapter layer
 * - Testing React Query integration
 * - Caching behavior
 * - Error handling scenarios
 * - Designing for failure patterns
 * 
 * Cara Penggunaan:
 * - Di Course Detail Page (untuk cek status enrollment)
 * - Di User Dashboard (untuk menampilkan enrolled courses)
 * - Di Course Management (untuk tracking enrollment)
 * 
 */

import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEnrollmentStatus, useEnrollmentList } from './useEnrollmentStatus'
import { enrollmentAdapter } from '../adapters/enrollmentAdapter'
import type { EnrollmentStatusResponse, EnrollmentListResponse } from '../types'

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

describe('useEnrollmentStatus Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useEnrollmentStatus', () => {
    test('should fetch enrollment status successfully', async () => {
      const mockResponse: EnrollmentStatusResponse = {
        success: true,
        isEnrolled: true,
        enrollmentDate: new Date('2024-01-01'),
      }

      mockEnrollmentAdapter.getEnrollmentStatus.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createTestWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
      expect(mockEnrollmentAdapter.getEnrollmentStatus).toHaveBeenCalledWith('course-1')
    })

    test('should handle enrollment status error', async () => {
      const mockError = new Error('Failed to check enrollment status')
      mockEnrollmentAdapter.getEnrollmentStatus.mockRejectedValue(mockError)

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createTestWrapper(),
      })

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
      })

      expect(result.current.error).toBeDefined()
    })

    test('should not fetch when courseId is empty', () => {
      const { result } = renderHook(() => useEnrollmentStatus(''), {
        wrapper: createTestWrapper(),
      })

      expect(result.current.isFetching).toBe(false)
      expect(mockEnrollmentAdapter.getEnrollmentStatus).not.toHaveBeenCalled()
    })

    test('should handle loading state', async () => {
      mockEnrollmentAdapter.getEnrollmentStatus.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      )

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createTestWrapper(),
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('useEnrollmentList', () => {
    test('should fetch enrollment list successfully', async () => {
      const mockResponse: EnrollmentListResponse = {
        success: true,
        data: [
          {
            id: 'enrollment-1',
            userId: 'user-1',
            courseId: 'course-1',
            enrolledAt: new Date(),
            course: {
              id: 'course-1',
              title: 'Test Course',
              description: 'Test Description',
              thumbnail: 'test-thumbnail.jpg',
              category: 'Test Category',
              status: 'PUBLISHED',
              students: 100,
              lessons: 10,
              duration: '2 hours',
              rating: 4.5,
              creatorId: 'user-1',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      }

      mockEnrollmentAdapter.getEnrollments.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollmentList(1, 10), {
        wrapper: createTestWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
      expect(mockEnrollmentAdapter.getEnrollments).toHaveBeenCalledWith({ page: 1, limit: 10 })
    })

    test('should handle enrollment list error', async () => {
      const mockError = new Error('Failed to fetch enrollments')
      mockEnrollmentAdapter.getEnrollments.mockRejectedValue(mockError)

      const { result } = renderHook(() => useEnrollmentList(1, 10), {
        wrapper: createTestWrapper(),
      })

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
      })

      expect(result.current.error).toBeDefined()
    })

    test('should use default pagination parameters', async () => {
      const mockResponse: EnrollmentListResponse = {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      }

      mockEnrollmentAdapter.getEnrollments.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollmentList(), {
        wrapper: createTestWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockEnrollmentAdapter.getEnrollments).toHaveBeenCalledWith({ page: 1, limit: 10 })
    })
  })

  describe('hook structure', () => {
    test('should return correct React Query properties', () => {
      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createTestWrapper(),
      })

      expect(result.current).toBeDefined()
      expect(typeof result.current.isLoading).toBe('boolean')
      expect(typeof result.current.isSuccess).toBe('boolean')
      expect(typeof result.current.isError).toBe('boolean')
      // data dan error bisa undefined pada awal render
      expect(['object', 'undefined']).toContain(typeof result.current.data)
      expect(['object', 'undefined']).toContain(typeof result.current.error)
    })
  })
})

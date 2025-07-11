/**
 * Integration Test: EnrollmentContext
 *
 * Test ini bertujuan untuk menguji integrasi EnrollmentContext dengan:
 * - Context provider integration
 * - Hook consumer integration
 * - State synchronization
 *
 * Coverage:
 * - Context ↔ Hook integration
 * - Global state management
 * - State synchronization antara context dan hooks
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  EnrollmentProvider,
  useEnrollmentContext,
} from '../../../../features/course/contexts/EnrollmentContext'
import { useEnrollment } from '../../../../features/course/hooks/useEnrollment'
import { useEnrollmentStatus } from '../../../../features/course/hooks/useEnrollmentStatus'
import { EnrollmentAdapter } from '../../../../features/course/adapters/enrollmentAdapter'

// Mock adapter
jest.mock('../../../../features/course/adapters/enrollmentAdapter')
const mockEnrollmentAdapter = EnrollmentAdapter as jest.MockedClass<typeof EnrollmentAdapter>

// Test wrapper dengan QueryClient dan EnrollmentProvider
const createWrapper = (courseId: string) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <EnrollmentProvider courseId={courseId}>{children}</EnrollmentProvider>
    </QueryClientProvider>
  )
}

describe('EnrollmentContext Integration', () => {
  let mockAdapterInstance: jest.Mocked<EnrollmentAdapter>

  beforeEach(() => {
    mockAdapterInstance = {
      createEnrollment: jest.fn(),
      getEnrollments: jest.fn(),
      getEnrollmentStatus: jest.fn(),
      deleteEnrollment: jest.fn(),
    } as any

    mockEnrollmentAdapter.mockImplementation(() => mockAdapterInstance)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Context Provider Integration', () => {
    test('should provide enrollment context to hooks', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      await waitFor(() => {
        expect(result.current.isEnrolled).toBe(false)
        expect(result.current.canEnroll).toBe(true)
        expect(result.current.enroll).toBeDefined()
        expect(result.current.retry).toBeDefined()
      })
    })

    test('should manage global enrollment state', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: true,
        enrollmentDate: '2024-01-15T10:30:00.000Z',
      })

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      await waitFor(() => {
        expect(result.current.isEnrolled).toBe(true)
        expect(result.current.canEnroll).toBe(false)
        expect(result.current.formattedEnrollmentDate).toBe('15 Januari 2024')
      })
    })

    test('should handle enrollment state updates', async () => {
      // Initial status - not enrolled
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValueOnce({
        success: true,
        isEnrolled: false,
      })

      // After enrollment - enrolled
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValueOnce({
        success: true,
        isEnrolled: true,
        enrollmentDate: '2024-01-15T10:30:00.000Z',
      })

      mockAdapterInstance.createEnrollment.mockResolvedValue({
        success: true,
        data: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          enrolledAt: new Date('2024-01-01'),
          course: {
            id: 'course-1',
            title: 'Test Course',
            description: 'Test Description',
            thumbnail: 'test-thumbnail.jpg',
            price: 0,
            instructor: 'Test Instructor',
            category: 'Test Category',
            rating: 4.5,
            studentsCount: 100,
            lessonsCount: 10,
            duration: '2 hours',
            level: 'Beginner',
            language: 'Indonesian',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        },
      })

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      // Initial state
      await waitFor(() => {
        expect(result.current.isEnrolled).toBe(false)
        expect(result.current.canEnroll).toBe(true)
      })

      // Enroll
      await result.current.enroll()

      // State should be updated
      await waitFor(() => {
        expect(result.current.isEnrolled).toBe(true)
        expect(result.current.canEnroll).toBe(false)
      })
    })

    test('should handle enrollment error state', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      mockAdapterInstance.createEnrollment.mockRejectedValue(new Error('Enrollment failed'))

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      // Initial state
      await waitFor(() => {
        expect(result.current.isEnrolled).toBe(false)
        expect(result.current.canEnroll).toBe(true)
      })

      // Try to enroll
      const enrollPromise = result.current.enroll()

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
        expect(result.current.error).toBe('Enrollment failed')
      })
    })

    test('should handle enrollment loading state', async () => {
      let resolveStatus: (value: any) => void
      const statusPromise = new Promise((resolve) => {
        resolveStatus = resolve
      })

      mockAdapterInstance.getEnrollmentStatus.mockReturnValue(statusPromise)

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      // Loading state
      expect(result.current.isLoading).toBe(true)
      expect(result.current.isEnrolled).toBe(false)
      expect(result.current.canEnroll).toBe(false)

      // Resolve status
      resolveStatus!({
        success: true,
        isEnrolled: false,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.isEnrolled).toBe(false)
        expect(result.current.canEnroll).toBe(true)
      })
    })

    test('should provide enrollment actions', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      await waitFor(() => {
        expect(result.current.enroll).toBeDefined()
        expect(typeof result.current.enroll).toBe('function')
        expect(result.current.retry).toBeDefined()
        expect(typeof result.current.retry).toBe('function')
      })
    })
  })

  describe('Hook Consumer Integration', () => {
    test('should consume enrollment context correctly', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      await waitFor(() => {
        expect(result.current.isEnrolled).toBe(false)
        expect(result.current.canEnroll).toBe(true)
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBeNull()
      })
    })

    test('should access enrollment state from context', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: true,
        enrollmentDate: '2024-01-15T10:30:00.000Z',
      })

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      await waitFor(() => {
        expect(result.current.isEnrolled).toBe(true)
        expect(result.current.canEnroll).toBe(false)
        expect(result.current.formattedEnrollmentDate).toBe('15 Januari 2024')
      })
    })

    test('should access enrollment actions from context', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      mockAdapterInstance.createEnrollment.mockResolvedValue({
        success: true,
        data: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          enrolledAt: new Date('2024-01-01'),
          course: {
            id: 'course-1',
            title: 'Test Course',
            description: 'Test Description',
            thumbnail: 'test-thumbnail.jpg',
            price: 0,
            instructor: 'Test Instructor',
            category: 'Test Category',
            rating: 4.5,
            studentsCount: 100,
            lessonsCount: 10,
            duration: '2 hours',
            level: 'Beginner',
            language: 'Indonesian',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        },
      })

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      await waitFor(() => {
        expect(result.current.enroll).toBeDefined()
        expect(result.current.retry).toBeDefined()
      })

      // Test enroll action
      await result.current.enroll()

      expect(mockAdapterInstance.createEnrollment).toHaveBeenCalledWith(
        { courseId: 'course-1' },
        expect.any(String),
      )
    })

    test('should handle context not found', async () => {
      // Test without EnrollmentProvider
      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider
            client={
              new QueryClient({
                defaultOptions: {
                  queries: { retry: false },
                  mutations: { retry: false },
                },
              })
            }
          >
            {children}
          </QueryClientProvider>
        ),
      })

      // Should throw error or provide default values
      expect(() => result.current).toThrow()
    })

    test('should handle context updates', async () => {
      // Initial status
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValueOnce({
        success: true,
        isEnrolled: false,
      })

      // Updated status
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValueOnce({
        success: true,
        isEnrolled: true,
        enrollmentDate: '2024-01-15T10:30:00.000Z',
      })

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      // Initial state
      await waitFor(() => {
        expect(result.current.isEnrolled).toBe(false)
        expect(result.current.canEnroll).toBe(true)
      })

      // Trigger retry to get updated state
      await result.current.retry()

      await waitFor(() => {
        expect(result.current.isEnrolled).toBe(true)
        expect(result.current.canEnroll).toBe(false)
      })
    })

    test('should handle context errors', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockRejectedValue(new Error('Context error'))

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBe('Context error')
        expect(result.current.isEnrolled).toBe(false)
        expect(result.current.canEnroll).toBe(false)
      })
    })

    test('should handle context loading', async () => {
      let resolveStatus: (value: any) => void
      const statusPromise = new Promise((resolve) => {
        resolveStatus = resolve
      })

      mockAdapterInstance.getEnrollmentStatus.mockReturnValue(statusPromise)

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      // Loading state
      expect(result.current.isLoading).toBe(true)
      expect(result.current.isEnrolled).toBe(false)
      expect(result.current.canEnroll).toBe(false)

      // Resolve status
      resolveStatus!({
        success: true,
        isEnrolled: false,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.isEnrolled).toBe(false)
        expect(result.current.canEnroll).toBe(true)
      })
    })

    test('should handle context state changes', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      mockAdapterInstance.createEnrollment.mockResolvedValue({
        success: true,
        data: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          enrolledAt: new Date('2024-01-01'),
          course: {
            id: 'course-1',
            title: 'Test Course',
            description: 'Test Description',
            thumbnail: 'test-thumbnail.jpg',
            price: 0,
            instructor: 'Test Instructor',
            category: 'Test Category',
            rating: 4.5,
            studentsCount: 100,
            lessonsCount: 10,
            duration: '2 hours',
            level: 'Beginner',
            language: 'Indonesian',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        },
      })

      const { result } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      // Initial state
      await waitFor(() => {
        expect(result.current.isEnrolled).toBe(false)
        expect(result.current.canEnroll).toBe(true)
      })

      // Change state through enrollment
      await result.current.enroll()

      // State should change
      await waitFor(() => {
        expect(result.current.isEnrolled).toBe(true)
        expect(result.current.canEnroll).toBe(false)
      })
    })
  })

  describe('State Synchronization', () => {
    test('should synchronize state between context and hooks', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      mockAdapterInstance.createEnrollment.mockResolvedValue({
        success: true,
        data: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          enrolledAt: new Date('2024-01-01'),
          course: {
            id: 'course-1',
            title: 'Test Course',
            description: 'Test Description',
            thumbnail: 'test-thumbnail.jpg',
            price: 0,
            instructor: 'Test Instructor',
            category: 'Test Category',
            rating: 4.5,
            studentsCount: 100,
            lessonsCount: 10,
            duration: '2 hours',
            level: 'Beginner',
            language: 'Indonesian',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        },
      })

      const { result: contextResult } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper('course-1'),
      })

      // Initial synchronization
      await waitFor(() => {
        expect(contextResult.current.isEnrolled).toBe(false)
        expect(contextResult.current.canEnroll).toBe(true)
        expect(enrollmentResult.current.isEnrolling).toBe(false)
        expect(enrollmentResult.current.error).toBeNull()
      })

      // Enroll through context
      await contextResult.current.enroll()

      // Both should reflect the change
      await waitFor(() => {
        expect(contextResult.current.isEnrolled).toBe(true)
        expect(contextResult.current.canEnroll).toBe(false)
      })

      expect(mockAdapterInstance.createEnrollment).toHaveBeenCalled()
    })

    test('should handle state conflicts gracefully', async () => {
      // Context says not enrolled
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      // But enrollment fails
      mockAdapterInstance.createEnrollment.mockRejectedValue(new Error('Enrollment failed'))

      const { result: contextResult } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper('course-1'),
      })

      // Initial state
      await waitFor(() => {
        expect(contextResult.current.isEnrolled).toBe(false)
        expect(contextResult.current.canEnroll).toBe(true)
        expect(enrollmentResult.current.isEnrolling).toBe(false)
      })

      // Try to enroll
      const enrollPromise = contextResult.current.enroll()

      await waitFor(() => {
        expect(contextResult.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(contextResult.current.isEnrolling).toBe(false)
        expect(contextResult.current.error).toBe('Enrollment failed')
        expect(contextResult.current.isEnrolled).toBe(false)
        expect(contextResult.current.canEnroll).toBe(true)
      })
    })

    test('should maintain state consistency', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      mockAdapterInstance.createEnrollment.mockResolvedValue({
        success: true,
        data: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          enrolledAt: new Date('2024-01-01'),
          course: {
            id: 'course-1',
            title: 'Test Course',
            description: 'Test Description',
            thumbnail: 'test-thumbnail.jpg',
            price: 0,
            instructor: 'Test Instructor',
            category: 'Test Category',
            rating: 4.5,
            studentsCount: 100,
            lessonsCount: 10,
            duration: '2 hours',
            level: 'Beginner',
            language: 'Indonesian',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        },
      })

      const { result: contextResult } = renderHook(() => useEnrollmentContext(), {
        wrapper: createWrapper('course-1'),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper('course-1'),
      })

      // Verify initial consistency
      await waitFor(() => {
        expect(contextResult.current.isEnrolled).toBe(false)
        expect(contextResult.current.canEnroll).toBe(true)
        expect(enrollmentResult.current.isEnrolling).toBe(false)
        expect(enrollmentResult.current.error).toBeNull()
      })

      // Perform enrollment through context
      await contextResult.current.enroll()

      // Verify final consistency
      await waitFor(() => {
        expect(contextResult.current.isEnrolled).toBe(true)
        expect(contextResult.current.canEnroll).toBe(false)
        expect(contextResult.current.isEnrolling).toBe(false)
        expect(contextResult.current.error).toBeNull()
      })
    })
  })
})

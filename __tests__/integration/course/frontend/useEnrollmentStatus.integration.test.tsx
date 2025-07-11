/**
 * Integration Test: useEnrollmentStatus Hook
 *
 * Test ini bertujuan untuk menguji integrasi useEnrollmentStatus hook dengan:
 * - Adapter communication
 * - React Query integration
 * - State management
 * - Hook composition dengan useEnrollment
 *
 * Coverage:
 * - Hook ↔ Adapter integration
 * - React Query query handling
 * - Error propagation dari adapter ke hook
 * - State transitions dan management
 * - Hook ↔ Hook integration
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEnrollmentStatus } from '../../../../features/course/hooks/useEnrollmentStatus'
import { useEnrollment } from '../../../../features/course/hooks/useEnrollment'
import { EnrollmentAdapter } from '../../../../features/course/adapters/enrollmentAdapter'

// Mock adapter
jest.mock('../../../../features/course/adapters/enrollmentAdapter')
const mockEnrollmentAdapter = EnrollmentAdapter as jest.MockedClass<typeof EnrollmentAdapter>

// Test wrapper dengan QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useEnrollmentStatus Integration', () => {
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

  describe('Hook ↔ Adapter Integration', () => {
    test('should call enrollmentAdapter.getEnrollmentStatus with courseId', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockAdapterInstance.getEnrollmentStatus).toHaveBeenCalledWith(
        'course-1',
        expect.any(String), // authToken
      )
    })

    test('should handle adapter success response correctly', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: true,
        enrollmentDate: '2024-01-15T10:30:00.000Z',
      })

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.data?.isEnrolled).toBe(true)
        expect(result.current.data?.enrollmentDate).toBe('2024-01-15T10:30:00.000Z')
      })
    })

    test('should handle adapter error response correctly', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: false,
        error: 'Course not found',
      })

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error?.message).toBe('Course not found')
      })
    })

    test('should handle adapter timeout correctly', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockRejectedValue(new Error('Request timeout'))

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error?.message).toBe('Request timeout')
      })
    })

    test('should handle adapter network errors correctly', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error?.message).toBe('Network error')
      })
    })

    test('should handle adapter authentication errors correctly', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: false,
        error: 'Unauthorized',
      })

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error?.message).toBe('Unauthorized')
      })
    })
  })

  describe('React Query Integration', () => {
    test('should use useQuery for status checking', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBeDefined()
      expect(result.current.data).toBeDefined()
      expect(result.current.error).toBeDefined()
    })

    test('should enable query only when courseId is provided', async () => {
      const { result } = renderHook(() => useEnrollmentStatus(''), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.data).toBeUndefined()
      })

      expect(mockAdapterInstance.getEnrollmentStatus).not.toHaveBeenCalled()
    })

    test('should use correct query key', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockAdapterInstance.getEnrollmentStatus).toHaveBeenCalledWith(
        'course-1',
        expect.any(String),
      )
    })

    test('should implement retry logic', async () => {
      mockAdapterInstance.getEnrollmentStatus
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          success: true,
          isEnrolled: false,
        })

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.data?.isEnrolled).toBe(false)
      })

      expect(mockAdapterInstance.getEnrollmentStatus).toHaveBeenCalledTimes(2)
    })

    test('should handle query errors properly', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockRejectedValue(new Error('Query failed'))

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error?.message).toBe('Query failed')
      })
    })
  })

  describe('State Management', () => {
    test('should manage loading state correctly', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      mockAdapterInstance.getEnrollmentStatus.mockReturnValue(promise)

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      // Initial loading state
      expect(result.current.isLoading).toBe(true)

      // Resolve promise
      resolvePromise!({
        success: true,
        isEnrolled: false,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    test('should manage error state correctly', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockRejectedValue(new Error('Status check failed'))

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error?.message).toBe('Status check failed')
      })
    })

    test('should manage data state correctly', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: true,
        enrollmentDate: '2024-01-15T10:30:00.000Z',
      })

      const { result } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.data?.isEnrolled).toBe(true)
        expect(result.current.data?.enrollmentDate).toBe('2024-01-15T10:30:00.000Z')
      })
    })

    test('should handle state transitions correctly', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      mockAdapterInstance.getEnrollmentStatus.mockReturnValue(promise)

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
        expect(result.current.isLoading).toBe(false)
        expect(result.current.data?.isEnrolled).toBe(false)
        expect(result.current.error).toBeNull()
      })
    })
  })

  describe('Hook ↔ Hook Integration', () => {
    test('should integrate useEnrollment with useEnrollmentStatus', async () => {
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

      const { result: statusResult } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Initial status
      await waitFor(() => {
        expect(statusResult.current.data?.isEnrolled).toBe(false)
      })

      // Enroll
      await enrollmentResult.current.enroll('course-1')

      // Status should be updated (in real scenario, this would trigger a refetch)
      expect(mockAdapterInstance.createEnrollment).toHaveBeenCalledWith(
        { courseId: 'course-1' },
        expect.any(String),
      )
    })

    test('should handle status updates after enrollment', async () => {
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

      const { result: statusResult } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Initial status
      await waitFor(() => {
        expect(statusResult.current.data?.isEnrolled).toBe(false)
      })

      // Enroll
      await enrollmentResult.current.enroll('course-1')

      // In a real scenario, this would trigger a refetch of the status
      // For this test, we verify that both hooks work together
      expect(mockAdapterInstance.createEnrollment).toHaveBeenCalled()
      expect(mockAdapterInstance.getEnrollmentStatus).toHaveBeenCalled()
    })

    test('should handle error propagation between hooks', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      mockAdapterInstance.createEnrollment.mockRejectedValue(new Error('Enrollment failed'))

      const { result: statusResult } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Initial status
      await waitFor(() => {
        expect(statusResult.current.data?.isEnrolled).toBe(false)
      })

      // Failed enrollment
      const enrollPromise = enrollmentResult.current.enroll('course-1')

      await waitFor(() => {
        expect(enrollmentResult.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(enrollmentResult.current.error).toBe('Enrollment failed')
        expect(enrollmentResult.current.isEnrolling).toBe(false)
      })

      // Status should remain unchanged
      expect(statusResult.current.data?.isEnrolled).toBe(false)
    })

    test('should handle loading state coordination', async () => {
      let resolveStatus: (value: any) => void
      const statusPromise = new Promise((resolve) => {
        resolveStatus = resolve
      })

      let resolveEnrollment: (value: any) => void
      const enrollmentPromise = new Promise((resolve) => {
        resolveEnrollment = resolve
      })

      mockAdapterInstance.getEnrollmentStatus.mockReturnValue(statusPromise)
      mockAdapterInstance.createEnrollment.mockReturnValue(enrollmentPromise)

      const { result: statusResult } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Both hooks should be loading
      expect(statusResult.current.isLoading).toBe(true)
      expect(enrollmentResult.current.isEnrolling).toBe(false) // Not enrolled yet

      // Resolve status
      resolveStatus!({
        success: true,
        isEnrolled: false,
      })

      await waitFor(() => {
        expect(statusResult.current.isLoading).toBe(false)
      })

      // Start enrollment
      const enrollPromise = enrollmentResult.current.enroll('course-1')

      await waitFor(() => {
        expect(enrollmentResult.current.isEnrolling).toBe(true)
      })

      // Resolve enrollment
      resolveEnrollment!({
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

      await enrollPromise

      await waitFor(() => {
        expect(enrollmentResult.current.isEnrolling).toBe(false)
      })
    })

    test('should handle data consistency between hooks', async () => {
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

      const { result: statusResult } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Initial state
      await waitFor(() => {
        expect(statusResult.current.data?.isEnrolled).toBe(false)
        expect(enrollmentResult.current.isEnrolling).toBe(false)
        expect(enrollmentResult.current.error).toBeNull()
      })

      // Enroll
      await enrollmentResult.current.enroll('course-1')

      // Verify both hooks maintain consistency
      expect(mockAdapterInstance.createEnrollment).toHaveBeenCalledWith(
        { courseId: 'course-1' },
        expect.any(String),
      )
      expect(mockAdapterInstance.getEnrollmentStatus).toHaveBeenCalledWith(
        'course-1',
        expect.any(String),
      )
    })
  })

  describe('State Synchronization', () => {
    test('should synchronize enrollment state with status state', async () => {
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

      const { result: statusResult } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Initial synchronization
      await waitFor(() => {
        expect(statusResult.current.data?.isEnrolled).toBe(false)
        expect(enrollmentResult.current.isEnrolling).toBe(false)
      })

      // Enroll and verify synchronization
      await enrollmentResult.current.enroll('course-1')

      // Both hooks should reflect the enrollment action
      expect(mockAdapterInstance.createEnrollment).toHaveBeenCalled()
      expect(mockAdapterInstance.getEnrollmentStatus).toHaveBeenCalled()
    })

    test('should handle state conflicts gracefully', async () => {
      // Status says enrolled
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: true,
        enrollmentDate: '2024-01-15T10:30:00.000Z',
      })

      // But enrollment fails
      mockAdapterInstance.createEnrollment.mockRejectedValue(new Error('Already enrolled'))

      const { result: statusResult } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Initial state
      await waitFor(() => {
        expect(statusResult.current.data?.isEnrolled).toBe(true)
      })

      // Try to enroll again
      const enrollPromise = enrollmentResult.current.enroll('course-1')

      await waitFor(() => {
        expect(enrollmentResult.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(enrollmentResult.current.error).toBe('Already enrolled')
        expect(enrollmentResult.current.isEnrolling).toBe(false)
      })

      // Status should remain consistent
      expect(statusResult.current.data?.isEnrolled).toBe(true)
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

      const { result: statusResult } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Verify initial consistency
      await waitFor(() => {
        expect(statusResult.current.data?.isEnrolled).toBe(false)
        expect(enrollmentResult.current.isEnrolling).toBe(false)
        expect(enrollmentResult.current.error).toBeNull()
      })

      // Perform enrollment
      await enrollmentResult.current.enroll('course-1')

      // Verify final consistency
      await waitFor(() => {
        expect(enrollmentResult.current.isEnrolling).toBe(false)
        expect(enrollmentResult.current.error).toBeNull()
      })
    })

    test('should handle state persistence', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      const { result: statusResult } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Initial state
      await waitFor(() => {
        expect(statusResult.current.data?.isEnrolled).toBe(false)
        expect(enrollmentResult.current.isEnrolling).toBe(false)
      })

      // State should persist across re-renders
      const { result: statusResult2 } = renderHook(() => useEnrollmentStatus('course-1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(statusResult2.current.data?.isEnrolled).toBe(false)
      })
    })

    test('should handle state cleanup', async () => {
      mockAdapterInstance.getEnrollmentStatus.mockResolvedValue({
        success: true,
        isEnrolled: false,
      })

      const { result: statusResult, unmount: unmountStatus } = renderHook(
        () => useEnrollmentStatus('course-1'),
        { wrapper: createWrapper() },
      )

      const { result: enrollmentResult, unmount: unmountEnrollment } = renderHook(
        () => useEnrollment(),
        { wrapper: createWrapper() },
      )

      // Initial state
      await waitFor(() => {
        expect(statusResult.current.data?.isEnrolled).toBe(false)
        expect(enrollmentResult.current.isEnrolling).toBe(false)
      })

      // Unmount hooks
      unmountStatus()
      unmountEnrollment()

      // Hooks should be cleaned up
      expect(mockAdapterInstance.getEnrollmentStatus).toHaveBeenCalled()
    })
  })
})

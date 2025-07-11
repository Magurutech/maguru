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

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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

describe('useEnrollment Integration', () => {
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
    test('should call enrollmentAdapter.createEnrollment with correct parameters', async () => {
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

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      await result.current.enroll('course-1')

      expect(mockAdapterInstance.createEnrollment).toHaveBeenCalledWith(
        { courseId: 'course-1' },
        expect.any(String), // authToken
      )
    })

    test('should handle adapter success response correctly', async () => {
      const mockResponse = {
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
      }

      mockAdapterInstance.createEnrollment.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      const enrollPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
        expect(result.current.error).toBeNull()
      })
    })

    test('should handle adapter error response correctly', async () => {
      mockAdapterInstance.createEnrollment.mockResolvedValue({
        success: false,
        error: 'Course not found',
      })

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      const enrollPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
        expect(result.current.error).toBe('Course not found')
      })
    })

    test('should handle adapter timeout correctly', async () => {
      mockAdapterInstance.createEnrollment.mockRejectedValue(new Error('Request timeout'))

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      const enrollPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
        expect(result.current.error).toBe('Request timeout')
      })
    })

    test('should handle adapter network errors correctly', async () => {
      mockAdapterInstance.createEnrollment.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      const enrollPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
        expect(result.current.error).toBe('Network error')
      })
    })

    test('should handle adapter authentication errors correctly', async () => {
      mockAdapterInstance.createEnrollment.mockResolvedValue({
        success: false,
        error: 'Unauthorized',
      })

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      const enrollPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
        expect(result.current.error).toBe('Unauthorized')
      })
    })

    test('should handle adapter validation errors correctly', async () => {
      mockAdapterInstance.createEnrollment.mockResolvedValue({
        success: false,
        error: 'Invalid course ID',
      })

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      const enrollPromise = result.current.enroll('invalid-course-id')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
        expect(result.current.error).toBe('Invalid course ID')
      })
    })

    test('should handle adapter unknown errors correctly', async () => {
      mockAdapterInstance.createEnrollment.mockRejectedValue(new Error('Unknown error'))

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      const enrollPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
        expect(result.current.error).toBe('Unknown error')
      })
    })
  })

  describe('React Query Integration', () => {
    test('should use useMutation for enrollment operations', async () => {
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

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      expect(result.current.enroll).toBeDefined()
      expect(typeof result.current.enroll).toBe('function')
    })

    test('should handle mutation loading state correctly', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      mockAdapterInstance.createEnrollment.mockReturnValue(promise)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      const enrollPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      resolvePromise!({
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
        expect(result.current.isEnrolling).toBe(false)
      })
    })

    test('should handle mutation error state correctly', async () => {
      mockAdapterInstance.createEnrollment.mockRejectedValue(new Error('Enrollment failed'))

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      const enrollPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
        expect(result.current.error).toBe('Enrollment failed')
      })
    })

    test('should handle mutation success state correctly', async () => {
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

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      const enrollPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
        expect(result.current.error).toBeNull()
      })
    })

    test('should provide mutation state to components', async () => {
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

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isEnrolling).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.enroll).toBeDefined()
    })
  })

  describe('State Management', () => {
    test('should manage isEnrolling state correctly', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      mockAdapterInstance.createEnrollment.mockReturnValue(promise)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Initial state
      expect(result.current.isEnrolling).toBe(false)

      // Start enrollment
      const enrollPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      // Complete enrollment
      resolvePromise!({
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
        expect(result.current.isEnrolling).toBe(false)
      })
    })

    test('should manage error state correctly', async () => {
      mockAdapterInstance.createEnrollment.mockRejectedValue(new Error('Enrollment failed'))

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Initial state
      expect(result.current.error).toBeNull()

      // Start enrollment
      const enrollPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      await waitFor(() => {
        expect(result.current.error).toBe('Enrollment failed')
        expect(result.current.isEnrolling).toBe(false)
      })
    })

    test('should clear error state on successful enrollment', async () => {
      // First attempt fails
      mockAdapterInstance.createEnrollment
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
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

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // First attempt
      const firstPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await firstPromise

      await waitFor(() => {
        expect(result.current.error).toBe('Network error')
        expect(result.current.isEnrolling).toBe(false)
      })

      // Second attempt
      const secondPromise = result.current.enroll('course-1')

      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await secondPromise

      await waitFor(() => {
        expect(result.current.error).toBeNull()
        expect(result.current.isEnrolling).toBe(false)
      })
    })

    test('should handle loading state transitions', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      mockAdapterInstance.createEnrollment.mockReturnValue(promise)

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Initial state
      expect(result.current.isEnrolling).toBe(false)

      // Start enrollment
      const enrollPromise = result.current.enroll('course-1')

      // Loading state
      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      // Complete enrollment
      resolvePromise!({
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

      // Final state
      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(false)
      })
    })

    test('should handle error state transitions', async () => {
      mockAdapterInstance.createEnrollment.mockRejectedValue(new Error('Enrollment failed'))

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      // Initial state
      expect(result.current.error).toBeNull()

      // Start enrollment
      const enrollPromise = result.current.enroll('course-1')

      // Loading state
      await waitFor(() => {
        expect(result.current.isEnrolling).toBe(true)
      })

      await enrollPromise

      // Error state
      await waitFor(() => {
        expect(result.current.error).toBe('Enrollment failed')
        expect(result.current.isEnrolling).toBe(false)
      })
    })

    test('should provide enrollment function', async () => {
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

      const { result } = renderHook(() => useEnrollment(), {
        wrapper: createWrapper(),
      })

      expect(result.current.enroll).toBeDefined()
      expect(typeof result.current.enroll).toBe('function')

      // Test function call
      await result.current.enroll('course-1')

      expect(mockAdapterInstance.createEnrollment).toHaveBeenCalledWith(
        { courseId: 'course-1' },
        expect.any(String),
      )
    })
  })
})

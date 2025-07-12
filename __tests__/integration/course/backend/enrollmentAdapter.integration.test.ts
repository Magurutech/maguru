/**
 * Integration Tests: enrollmentAdapter ↔ API
 *
 * Test ini bertujuan untuk menguji interaksi antara enrollmentAdapter
 * dan API endpoints dengan fokus pada network communication dan error handling.
 *
 * Coverage: Network errors, API responses, retry logic, timeout handling
 * Designing for Failure: Network failures, API errors, graceful degradation
 */

import { enrollmentAdapter } from '../../../../features/course/adapters/enrollmentAdapter'
import type {
  EnrollmentRequest,
  EnrollmentResponse,
  EnrollmentListResponse,
  EnrollmentStatusResponse,
} from '../../../../features/course/types'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('enrollmentAdapter Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockReset()
  })

  describe('Network Error Handling', () => {
    const mockRequest: EnrollmentRequest = {
      courseId: 'course-123',
    }

    test('should handle network errors gracefully', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Network connection failed'))

      // Act & Assert
      await expect(
        enrollmentAdapter.enrollCourse(mockRequest, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Network connection failed')
    })

    test('should handle timeout errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Request timeout'))

      // Act & Assert
      await expect(
        enrollmentAdapter.enrollCourse(mockRequest, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Request timeout')
    })
  })

  describe('API Error Handling', () => {
    const mockRequest: EnrollmentRequest = {
      courseId: 'course-123',
    }

    test('should handle 400 validation errors', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ success: false, error: 'Validation failed' }),
      } as Response)

      // Act & Assert
      await expect(
        enrollmentAdapter.enrollCourse(mockRequest, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Validation failed')
    })

    test('should handle 409 conflict errors', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ success: false, error: 'Already enrolled' }),
      } as Response)

      // Act & Assert
      await expect(
        enrollmentAdapter.enrollCourse(mockRequest, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Already enrolled')
    })

    test('should handle 500 server errors', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ success: false, error: 'Internal server error' }),
      } as Response)

      // Act & Assert
      await expect(
        enrollmentAdapter.enrollCourse(mockRequest, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Internal server error')
    })
  })

  describe('Successful API Calls', () => {
    test('should handle successful enrollment creation', async () => {
      // Arrange
      const mockResponse: EnrollmentResponse = {
        success: true,
        data: {
          id: 'enrollment-123',
          userId: 'user-123',
          courseId: 'course-123',
          enrolledAt: new Date(),
        },
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.enrollCourse({ courseId: 'course-123' })

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse.data)
    })

    test('should handle successful enrollment status check', async () => {
      // Arrange
      const mockResponse: EnrollmentStatusResponse = {
        success: true,
        isEnrolled: true,
        enrollmentDate: new Date('2024-01-01'),
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollmentStatus('course-123')

      // Assert
      expect(result.success).toBe(true)
      expect(result.isEnrolled).toBe(true)
    })

    test('should handle successful enrollment list retrieval', async () => {
      // Arrange
      const mockResponse: EnrollmentListResponse = {
        success: true,
        data: [
          {
            id: 'enrollment-1',
            userId: 'user-123',
            courseId: 'course-1',
            enrolledAt: new Date(),
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 })

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('enrollment-1')
    })
  })

  describe('Retry Logic', () => {
    test('should retry on temporary failures', async () => {
      // Arrange
      const mockResponse: EnrollmentResponse = {
        success: true,
        data: {
          id: 'enrollment-123',
          userId: 'user-123',
          courseId: 'course-123',
          enrolledAt: new Date(),
        },
      }

      mockFetch.mockRejectedValueOnce(new Error('Temporary failure')).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.enrollCourse({ courseId: 'course-123' })

      // Assert
      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    test('should not retry on permanent errors', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: 'Course not found' }),
      } as Response)

      // Act & Assert
      await expect(
        enrollmentAdapter.enrollCourse({ courseId: 'course-123' }, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Course not found')
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('Batch Operations', () => {
    test('should handle batch enrollment status check', async () => {
      // Arrange
      const courseIds = ['course-1', 'course-2']

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true, isEnrolled: true }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true, isEnrolled: false }),
        } as Response)

      // Act
      const result = await enrollmentAdapter.batchCheckEnrollmentStatus(courseIds, {
        maxRetries: 0,
        timeout: 10,
      })

      // Assert
      expect(result).toEqual({
        'course-1': true,
        'course-2': false,
      })
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    test('should handle empty courseIds array', async () => {
      // Act
      const result = await enrollmentAdapter.batchCheckEnrollmentStatus([])

      // Assert
      expect(result).toEqual({})
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })
})

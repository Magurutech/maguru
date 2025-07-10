/**
 * Integration Tests: EnrollmentAdapter ↔ API
 *
 * Test ini bertujuan untuk menguji interaksi antara EnrollmentAdapter
 * dan API endpoints dengan fokus pada network communication dan error handling.
 *
 * Coverage: Network errors, API responses, retry logic, timeout handling
 * Designing for Failure: Network failures, API errors, graceful degradation
 */

import { EnrollmentAdapter } from '../../../../features/course/adapters/enrollmentAdapter'
import {
  CreateEnrollmentRequest,
  EnrollmentResponse,
  EnrollmentListResponse,
  EnrollmentStatusResponse,
  CourseStatus,
} from '../../../../features/course/types'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('EnrollmentAdapter Integration', () => {
  let enrollmentAdapter: EnrollmentAdapter

  beforeEach(() => {
    enrollmentAdapter = new EnrollmentAdapter()
    jest.clearAllMocks()
  })

  describe('Network Error Propagation', () => {
    const mockRequest: CreateEnrollmentRequest = {
      courseId: 'course-123',
    }

    it('should propagate network errors from adapter to service', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Network connection failed'))

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Network connection failed')
    })

    it('should handle network timeout gracefully', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Request timeout'))

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Request timeout')
    })

    it('should handle connection refused errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Connection refused'))

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Connection refused')
    })

    it('should handle DNS resolution failures', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('DNS resolution failed'))

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('DNS resolution failed')
    })
  })

  describe('API Error Handling', () => {
    const mockRequest: CreateEnrollmentRequest = {
      courseId: 'course-123',
    }

    it('should handle 401 Unauthorized errors properly', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ success: false, error: 'Unauthorized' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'invalid-token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Unauthorized')
    })

    it('should handle 403 Forbidden errors properly', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ success: false, error: 'Forbidden' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Forbidden')
    })

    it('should handle 404 Not Found errors properly', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: 'Course not found' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Course not found')
    })

    it('should handle 409 Conflict errors properly', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ success: false, error: 'Already enrolled' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Already enrolled')
    })

    it('should handle 422 Validation errors properly', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ success: false, error: 'Validation failed' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: '' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Validation failed')
    })

    it('should handle 500 Internal Server errors properly', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ success: false, error: 'Internal server error' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Internal server error')
    })
  })

  describe('Error State Management', () => {
    it('should provide meaningful error messages', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ success: false, error: 'Bad request' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Bad request')
    })

    it('should handle malformed error responses', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ invalid: 'response format' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('invalid')
    })

    it('should handle non-JSON error responses', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Plain text error',
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Plain text error')
    })

    it('should handle empty error responses', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Unknown error')
    })
  })

  describe('Retry Mechanisms', () => {
    const mockRequest: CreateEnrollmentRequest = {
      courseId: 'course-123',
    }

    const mockResponse: EnrollmentResponse = {
      success: true,
      data: {
        id: 'enrollment-123',
        userId: 'user-123',
        courseId: 'course-123',
        enrolledAt: new Date(),
        course: {
          id: 'course-123',
          title: 'Test Course',
          description: 'Test description',
          thumbnail: '/images/test.jpg',
          status: 'PUBLISHED' as CourseStatus,
          students: 10,
          lessons: 5,
          duration: '2 jam',
          rating: 4.5,
          category: 'Technology',
          creatorId: 'creator-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    }

    it('should handle temporary network failures gracefully', async () => {
      // Arrange
      mockFetch
        .mockRejectedValueOnce(new Error('Temporary network failure'))
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => mockResponse,
        } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should not retry on permanent errors', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: 'Course not found' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should respect retry-after header', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        headers: new Headers({ 'retry-after': '60' }),
        json: async () => ({ success: false, error: 'Rate limited' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Rate limited')
    })

    it('should implement exponential backoff', async () => {
      // Arrange
      mockFetch
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => mockResponse,
        } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    it('should limit maximum retry attempts', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Persistent failure'))

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(mockFetch).toHaveBeenCalledTimes(3) // Max retry attempts
    })
  })

  describe('Different Error Types', () => {
    it('should handle CORS errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('CORS policy violation'))

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('CORS policy violation')
    })

    it('should handle SSL/TLS errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('SSL certificate error'))

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('SSL certificate error')
    })

    it('should handle rate limiting errors', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        headers: new Headers({ 'retry-after': '30' }),
        json: async () => ({ success: false, error: 'Rate limited' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Rate limited')
    })

    it('should handle server overload errors', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({ success: false, error: 'Service unavailable' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Service unavailable')
    })
  })

  describe('Data Transformation', () => {
    it('should transform API response data correctly', async () => {
      // Arrange
      const mockResponse: EnrollmentListResponse = {
        success: true,
        data: [
          {
            id: 'enrollment-1',
            userId: 'user-123',
            courseId: 'course-1',
            enrolledAt: new Date(),
            course: {
              id: 'course-1',
              title: 'Course 1',
              description: 'Description 1',
              thumbnail: '/images/course1.jpg',
              status: 'PUBLISHED' as CourseStatus,
              students: 10,
              lessons: 5,
              duration: '2 jam',
              rating: 4.5,
              category: 'Technology',
              creatorId: 'creator-1',
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

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, 'token')

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('enrollment-1')
      expect(result.data[0].course?.title).toBe('Course 1')
    })

    it('should handle empty response data', async () => {
      // Arrange
      const emptyResponse: EnrollmentListResponse = {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => emptyResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, 'token')

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(0)
    })

    it('should handle null response data', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: null }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Malformed response - null data')
    })

    it('should validate response schema', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ invalid: 'response format' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Malformed response - missing success field')
    })
  })

  describe('Request/Response Headers', () => {
    it('should include proper authentication headers', async () => {
      // Arrange
      const mockAuthToken = 'mock-auth-token'
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: [] }),
      } as Response)

      // Act
      await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, mockAuthToken)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockAuthToken}`,
          }),
          signal: expect.any(AbortSignal),
        }),
      )
    })

    it('should handle missing auth token gracefully', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ success: false, error: 'Unauthorized' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, '')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Unauthorized')
    })

    it('should include proper content-type headers for POST requests', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ success: true }),
      } as Response)

      // Act
      await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          signal: expect.any(AbortSignal),
        }),
      )
    })

    it('should handle custom headers correctly', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      } as Response)

      // Act
      await enrollmentAdapter.getEnrollmentStatus('course-123', 'token')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer token',
          }),
          signal: expect.any(AbortSignal),
        }),
      )
    })
  })

  describe('Successful API Calls', () => {
    it('should handle successful POST enrollment', async () => {
      // Arrange
      const mockResponse: EnrollmentResponse = {
        success: true,
        data: {
          id: 'enrollment-123',
          userId: 'user-123',
          courseId: 'course-123',
          enrolledAt: new Date(),
          course: {
            id: 'course-123',
            title: 'Test Course',
            description: 'Test description',
            thumbnail: '/images/test.jpg',
            status: 'PUBLISHED' as CourseStatus,
            students: 10,
            lessons: 5,
            duration: '2 jam',
            rating: 4.5,
            category: 'Technology',
            creatorId: 'creator-123',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse.data)
    })

    it('should handle successful GET enrollments', async () => {
      // Arrange
      const mockResponse: EnrollmentListResponse = {
        success: true,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, 'token')

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse.data)
    })

    it('should handle successful GET enrollment status', async () => {
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
      const result = await enrollmentAdapter.getEnrollmentStatus('course-123', 'token')

      // Assert
      expect(result.success).toBe(true)
      expect(result.isEnrolled).toBe(true)
    })

    it('should handle successful DELETE enrollment', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.deleteEnrollment('enrollment-123', 'token')

      // Assert
      expect(result.success).toBe(true)
    })
  })
})

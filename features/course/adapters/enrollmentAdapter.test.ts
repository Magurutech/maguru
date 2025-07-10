/**
 * Unit Tests: EnrollmentAdapter
 *
 * Test ini bertujuan untuk menguji client-side API communication
 * untuk enrollment adapter dengan pendekatan TDD dan designing for failure.
 *
 * Coverage Target: ≥ 90% untuk semua API operations
 * Error Scenarios: Network errors, API errors, timeout handling
 * Designing for Failure: Retry logic, timeout handling, graceful fallback
 */

import { EnrollmentAdapter } from './enrollmentAdapter'
import { CreateEnrollmentRequest, EnrollmentResponse, CourseStatus } from '../types'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('EnrollmentAdapter', () => {
  let enrollmentAdapter: EnrollmentAdapter

  beforeEach(() => {
    enrollmentAdapter = new EnrollmentAdapter()
    jest.clearAllMocks()
    // Reset fetch mock
    mockFetch.mockReset()
  })

  describe('createEnrollment', () => {
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

    it('should make successful POST request with auth', async () => {
      // Arrange
      const mockAuthToken = 'mock-auth-token'
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, mockAuthToken)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse.data)
      expect(mockFetch).toHaveBeenCalledWith('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockAuthToken}`,
        },
        body: JSON.stringify(mockRequest),
        signal: expect.any(AbortSignal),
      })
    })

    it('should handle missing authentication (401)', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ success: false, error: 'Unauthorized' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, '')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Unauthorized')
    })

    it('should handle forbidden access (403)', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ success: false, error: 'Forbidden' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'invalid-token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Forbidden')
    })

    it('should handle validation errors (400)', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ success: false, error: 'Validation failed' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: '' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Validation failed')
    })

    it('should handle duplicate enrollment (409)', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
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

    it('should handle course not found (404)', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
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

    it('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Network error'))

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('should handle timeout errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Request timeout'))

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Request timeout')
    })

    it('should retry on temporary failures', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Temporary failure')).mockResolvedValueOnce({
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

    it('should handle malformed response', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ invalid: 'response' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment(mockRequest, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Malformed response')
    })
  })

  describe('getEnrollments', () => {
    it('should make successful GET request with auth', async () => {
      // Arrange
      const mockAuthToken = 'mock-auth-token'
      const testResponse = {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => testResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, mockAuthToken)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(testResponse.data)
      expect(mockFetch).toHaveBeenCalledWith('/api/enrollments?page=1&limit=10', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${mockAuthToken}`,
        },
        signal: expect.any(AbortSignal),
      })
    })

    it('should handle pagination parameters', async () => {
      // Arrange
      const testResponse = {
        success: true,
        data: [],
        pagination: { page: 2, limit: 20, total: 0, totalPages: 0 },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => testResponse,
      } as Response)

      // Act
      await enrollmentAdapter.getEnrollments({ page: 2, limit: 20 }, 'token')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/enrollments?page=2&limit=20', expect.any(Object))
    })

    it('should handle missing authentication', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
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

    it('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Network error'))

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('should handle API error responses', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ success: false, error: 'Internal server error' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Internal server error')
    })

    it('should transform response data correctly', async () => {
      // Arrange
      const testResponse = {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => testResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, 'token')

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('enrollment-1')
      expect(result.data[0].course?.title).toBe('Course 1')
    })
  })

  describe('getEnrollmentStatus', () => {
    it('should make successful GET request', async () => {
      // Arrange
      const testResponse = {
        success: true,
        isEnrolled: true,
        enrollmentDate: new Date('2024-01-01'),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => testResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollmentStatus('course-123', 'token')

      // Assert
      expect(result.success).toBe(true)
      expect(result.isEnrolled).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith('/api/courses/course-123/enrollment-status', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer token',
        },
        signal: expect.any(AbortSignal),
      })
    })

    it('should handle course not found', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: 'Course not found' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollmentStatus('invalid-course', 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Course not found')
    })

    it('should handle authentication errors', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ success: false, error: 'Unauthorized' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollmentStatus('course-123', 'invalid-token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Unauthorized')
    })

    it('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Network error'))

      // Act
      const result = await enrollmentAdapter.getEnrollmentStatus('course-123', 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('should return correct enrollment status', async () => {
      // Arrange
      const notEnrolledResponse = { success: true, isEnrolled: false }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => notEnrolledResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollmentStatus('course-123', 'token')

      // Assert
      expect(result.success).toBe(true)
      expect(result.isEnrolled).toBe(false)
    })
  })

  describe('deleteEnrollment', () => {
    it('should make successful DELETE request with auth', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.deleteEnrollment('enrollment-123', 'token')

      // Assert
      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith('/api/enrollments/enrollment-123', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer token',
        },
        signal: expect.any(AbortSignal),
      })
    })

    it('should handle missing authentication', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ success: false, error: 'Unauthorized' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.deleteEnrollment('enrollment-123', '')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Unauthorized')
    })

    it('should handle enrollment not found', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: 'Enrollment not found' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.deleteEnrollment('invalid-enrollment', 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Enrollment not found')
    })

    it('should handle unauthorized deletion', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ success: false, error: 'Forbidden' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.deleteEnrollment('enrollment-123', 'invalid-token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Forbidden')
    })

    it('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Network error'))

      // Act
      const result = await enrollmentAdapter.deleteEnrollment('enrollment-123', 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })

  describe('Error Handling', () => {
    it('should handle CORS errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('CORS error'))

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('CORS error')
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
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Headers({ 'retry-after': '60' }),
        json: async () => ({ success: false, error: 'Rate limited' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Rate limited')
    })

    it('should respect retry-after header', async () => {
      // Arrange
      const retryAfterResponse = {
        ok: false,
        status: 429,
        headers: new Headers({ 'retry-after': '30' }),
        json: async () => ({ success: false, error: 'Rate limited' }),
      } as Response

      mockFetch.mockResolvedValueOnce(retryAfterResponse)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Rate limited')
    })

    it('should handle different error response formats', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Different error format' }),
      } as Response)

      // Act
      const result = await enrollmentAdapter.createEnrollment({ courseId: 'course-123' }, 'token')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Different error format')
    })
  })
})

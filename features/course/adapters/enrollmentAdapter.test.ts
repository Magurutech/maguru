/**
 * Unit Test: enrollmentAdapter
 *
 * @description
 * Test untuk enrollmentAdapter yang menangani API communication untuk enrollment operations.
 * Mengikuti arsitektur Maguru untuk testing dengan:
 * - Mock fetch API
 * - Testing error handling
 * - Testing timeout handling
 * - Designing for failure patterns
 */

import { enrollmentAdapter } from './enrollmentAdapter'
import type { EnrollmentRequest, EnrollmentResponse, EnrollmentStatusResponse } from '../types'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('enrollmentAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockReset()
  })

  describe('enrollCourse', () => {
    const mockRequest: EnrollmentRequest = {
      courseId: 'course-123',
    }

    const mockResponse: EnrollmentResponse = {
      success: true,
      data: {
        id: 'enrollment-123',
        userId: 'user-123',
        courseId: 'course-123',
        enrolledAt: new Date(),
      },
    }

    test('should make successful POST request', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.enrollCourse(mockRequest)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse.data)
      expect(mockFetch).toHaveBeenCalledWith('/api/enrollments', expect.any(Object))
      expect(mockFetch.mock.calls[0][1]?.method).toBe('POST')
      expect(mockFetch.mock.calls[0][1]?.body).toBe(JSON.stringify(mockRequest))
    })

    test('should handle validation errors (400)', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ success: false, error: 'Validation failed' }),
      } as Response)

      // Act & Assert
      await expect(
        enrollmentAdapter.enrollCourse({ courseId: '' }, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Validation failed')
    })

    test('should handle duplicate enrollment (409)', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ success: false, error: 'Already enrolled' }),
      } as Response)

      // Act & Assert
      await expect(
        enrollmentAdapter.enrollCourse(mockRequest, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Already enrolled')
    })

    test('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Network error'))

      // Act & Assert
      await expect(
        enrollmentAdapter.enrollCourse(mockRequest, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Network error')
    })
  })

  describe('unenrollCourse', () => {
    test('should make successful DELETE request', async () => {
      // Arrange
      const mockResponse = { success: true }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.unenrollCourse('course-123')

      // Assert
      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith('/api/enrollments/course-123', expect.any(Object))
      expect(mockFetch.mock.calls[0][1]?.method).toBe('DELETE')
    })

    test('should handle enrollment not found', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: 'Enrollment not found' }),
      } as Response)

      // Act & Assert
      await expect(
        enrollmentAdapter.unenrollCourse('invalid-course', { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Enrollment not found')
    })

    test('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Network error'))

      // Act & Assert
      await expect(
        enrollmentAdapter.unenrollCourse('course-123', { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Network error')
    })
  })

  describe('getEnrollmentStatus', () => {
    test('should make successful GET request', async () => {
      // Arrange
      const mockResponse: EnrollmentStatusResponse = {
        success: true,
        isEnrolled: true,
        enrollmentDate: new Date('2024-01-01'),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollmentStatus('course-123')

      // Assert
      expect(result.success).toBe(true)
      expect(result.isEnrolled).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/courses/course-123/enrollment-status',
        expect.any(Object),
      )
      // Tidak perlu assert method GET karena default fetch
    })

    test('should handle course not found', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: 'Course not found' }),
      } as Response)

      // Act & Assert
      await expect(
        enrollmentAdapter.getEnrollmentStatus('invalid-course', { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Course not found')
    })

    test('should return correct enrollment status', async () => {
      // Arrange
      const notEnrolledResponse = { success: true, isEnrolled: false }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => notEnrolledResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollmentStatus('course-123')

      // Assert
      expect(result.success).toBe(true)
      expect(result.isEnrolled).toBe(false)
    })
  })

  describe('getEnrollments', () => {
    test('should make successful GET request with pagination', async () => {
      // Arrange
      const testResponse = {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => testResponse,
      } as Response)

      // Act
      const result = await enrollmentAdapter.getEnrollments({ page: 1, limit: 10 })

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(testResponse.data)
      expect(mockFetch).toHaveBeenCalledWith('/api/enrollments?page=1&limit=10', expect.any(Object))
      // Tidak perlu assert method GET karena default fetch
    })

    test('should handle API error responses', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ success: false, error: 'Internal server error' }),
      } as Response)

      // Act & Assert
      await expect(
        enrollmentAdapter.getEnrollments({ page: 1, limit: 10 }, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Internal server error')
    })
  })

  describe('batchCheckEnrollmentStatus', () => {
    test('should check multiple course enrollment statuses', async () => {
      // Arrange
      const courseIds = ['course-1', 'course-2', 'course-3']

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
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true, isEnrolled: true }),
        } as Response)

      // Act
      const result = await enrollmentAdapter.batchCheckEnrollmentStatus(courseIds)

      // Assert
      expect(result).toEqual({
        'course-1': true,
        'course-2': false,
        'course-3': true,
      })
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    test('should handle empty courseIds array', async () => {
      // Act
      const result = await enrollmentAdapter.batchCheckEnrollmentStatus([])

      // Assert
      expect(result).toEqual({})
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    test('should handle timeout errors', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Request timeout'))

      // Act & Assert
      await expect(
        enrollmentAdapter.enrollCourse({ courseId: 'course-123' }, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Request timeout')
    })

    test('should handle different error response formats', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Different error format' }),
      } as Response)

      // Act & Assert
      await expect(
        enrollmentAdapter.enrollCourse({ courseId: 'course-123' }, { maxRetries: 0, timeout: 10 }),
      ).rejects.toThrow('Different error format')
    })
  })
})

// import { auth } from '@clerk/nextjs/server'
// import { Feature } from '@/features/homepage/component/Feature'
/**
 * Unit Test: CourseAdapter
 *
 * Test ini menguji semua method dalam CourseAdapter:
 * - getCourses: Mengambil daftar kursus dengan pagination dan search
 * - getCourseById: Mengambil detail kursus berdasarkan ID
 * - createCourse: Membuat kursus baru dengan FormData
 * - updateCourse: Update metadata kursus dengan FormData
 * - deleteCourse: Hapus kursus
 * - getCoursesByCreator: Mengambil kursus berdasarkan creator
 * - updateCourseStatus: Update status kursus
 * - Utility functions: Thumbnail handling
 */

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

import { CourseAdapter } from './courseAdapter'
import { CourseStatus } from '../types'

describe('CourseAdapter', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getCourses', () => {
    test('should make successful GET request without search parameters', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: {
          courses: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      // Act
      const result = await CourseAdapter.getCourses(1, 10)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/courses?page=1&limit=10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: expect.any(AbortSignal),
      })
      expect(result).toEqual(mockResponse)
    })

    test('should make successful GET request with search parameters', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: {
          courses: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      // Act
      const result = await CourseAdapter.getCourses(1, 10, {
        searchQuery: 'react',
        selectedStatus: 'PUBLISHED',
        selectedCategory: 'Programming',
      })

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/courses?page=1&limit=10&search=react&status=PUBLISHED&category=Programming',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: expect.any(AbortSignal),
        },
      )
      expect(result).toEqual(mockResponse)
    })

    test('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // Act
      const result = await CourseAdapter.getCourses()

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Network error',
      })
    })

    test('should handle timeout errors', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(
        new Error('Request timeout - server tidak merespons dalam waktu yang ditentukan'),
      )

      // Act
      const result = await CourseAdapter.getCourses()

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Koneksi lambat. Silakan coba lagi.',
      })
    })

    test('should handle API error responses', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error' }),
      })

      // Act
      const result = await CourseAdapter.getCourses()

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Internal Server Error',
      })
    })

    test('should handle 401 authentication error', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
      })

      // Act
      const result = await CourseAdapter.getCourses()

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Authentication required. Please sign in.',
      })
    })

    test('should handle 403 forbidden error', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Forbidden' }),
      })

      // Act
      const result = await CourseAdapter.getCourses()

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Access denied. You do not have permission to view courses.',
      })
    })
  })

  describe('getCourseById', () => {
    test('should make successful GET request', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: { id: 'course-1', title: 'Test Course' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      // Act
      const result = await CourseAdapter.getCourseById('course-1')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/courses/course-1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: expect.any(AbortSignal),
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle 404 error', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Course not found.' }),
      })

      // Act
      const result = await CourseAdapter.getCourseById('non-existent')

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Course not found.',
      })
    })
  })

  describe('createCourse', () => {
    const validCourseData = {
      title: 'New Course',
      description: 'New Description',
      thumbnail: '/new-thumbnail.jpg',
      category: 'New Category',
      status: CourseStatus.DRAFT,
    }

    test('should make successful POST request with FormData', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: { id: 'course-2', ...validCourseData },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      })

      // Act
      const result = await CourseAdapter.createCourse(validCourseData)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/courses', {
        method: 'POST',
        headers: {},
        body: expect.any(FormData),
        signal: expect.any(AbortSignal),
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle 401 Unauthorized from API', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid token' }),
      })

      // Act
      const result = await CourseAdapter.createCourse(validCourseData)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Authentication required. Please sign in.',
      })
    })

    test('should handle 403 Forbidden (role validation)', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Access denied' }),
      })

      // Act
      const result = await CourseAdapter.createCourse(validCourseData)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Access denied. Only creators and admins can create courses.',
      })
    })

    test('should handle 422 validation error', async () => {
      // Arrange
      const invalidCourseData = {
        title: '', // Invalid: empty title
        description: 'New Description',
        category: 'New Category',
        status: CourseStatus.DRAFT,
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({
          error: 'Validation failed',
          details: [{ field: 'title', message: 'Judul kursus harus diisi' }],
        }),
      })

      // Act
      const result = await CourseAdapter.createCourse(invalidCourseData)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Data tidak valid. Silakan periksa kembali input Anda.',
      })
    })

    test('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // Act
      const result = await CourseAdapter.createCourse(validCourseData)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Network error',
      })
    })

    test('should handle File thumbnail', async () => {
      // Arrange
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const courseDataWithFile = {
        ...validCourseData,
        thumbnail: file,
      }

      const mockResponse = {
        success: true,
        data: { id: 'course-3', ...validCourseData },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      })

      // Act
      const result = await CourseAdapter.createCourse(courseDataWithFile)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/courses', {
        method: 'POST',
        headers: {},
        body: expect.any(FormData),
        signal: expect.any(AbortSignal),
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateCourse', () => {
    const courseData = {
      id: 'course-1',
      title: 'Updated Course',
      description: 'Updated Description',
      thumbnail: '/updated-thumbnail.jpg',
      category: 'Updated Category',
      status: CourseStatus.PUBLISHED,
    }

    test('should make successful PUT request with FormData', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: courseData,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      // Act
      const result = await CourseAdapter.updateCourse('course-1', courseData)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/courses/course-1', {
        method: 'PUT',
        headers: {},
        body: expect.any(FormData),
        signal: expect.any(AbortSignal),
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle 403 forbidden access', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Forbidden' }),
      })

      // Act
      const result = await CourseAdapter.updateCourse('course-1', courseData)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Access denied. Only course owners can update this course.',
      })
    })

    test('should handle 404 not found', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      })

      // Act
      const result = await CourseAdapter.updateCourse('course-1', courseData)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Course not found or you do not have access to it.',
      })
    })
  })

  describe('deleteCourse', () => {
    test('should make successful DELETE request', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Course deleted successfully',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      // Act
      const result = await CourseAdapter.deleteCourse('course-1')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/courses/course-1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: expect.any(AbortSignal),
      })
      expect(result).toEqual({
        success: true,
        data: { id: 'course-1' },
        error: undefined,
      })
    })

    test('should handle 403 forbidden access', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Forbidden' }),
      })

      // Act
      const result = await CourseAdapter.deleteCourse('course-1')

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Access denied. Only course owners can delete this course.',
      })
    })

    test('should handle server error', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error' }),
      })

      // Act
      const result = await CourseAdapter.deleteCourse('course-1')

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Internal Server Error',
      })
    })
  })

  describe('getCoursesByCreator', () => {
    test('should make successful GET request with creatorId filter', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: {
          courses: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      // Act
      const result = await CourseAdapter.getCoursesByCreator('creator-1', 1, 10)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/courses?page=1&limit=10&creatorId=creator-1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: expect.any(AbortSignal),
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle 403 forbidden access', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Forbidden' }),
      })

      // Act
      const result = await CourseAdapter.getCoursesByCreator('creator-1', 1, 10)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Access denied. You do not have permission to view these courses.',
      })
    })
  })

  describe('updateCourseStatus', () => {
    test('should make successful PATCH request', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: { id: 'course-1', status: 'PUBLISHED' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      // Act
      const result = await CourseAdapter.updateCourseStatus('course-1', 'PUBLISHED')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/courses/course-1/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PUBLISHED' }),
        signal: expect.any(AbortSignal),
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle 403 forbidden access', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Forbidden' }),
      })

      // Act
      const result = await CourseAdapter.updateCourseStatus('course-1', 'PUBLISHED')

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Access denied. Only course owners can update course status.',
      })
    })

    test('should handle 422 invalid status', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({ error: 'Invalid status' }),
      })

      // Act
      const result = await CourseAdapter.updateCourseStatus('course-1', 'INVALID_STATUS')

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Status tidak valid. Silakan pilih status yang benar.',
      })
    })
  })

  describe('Utility Functions', () => {
    describe('getDefaultThumbnailUrl', () => {
      test('should return default thumbnail URL', () => {
        // Act
        const result = CourseAdapter.getDefaultThumbnailUrl()

        // Assert
        expect(result).toBe('/images/default-course-thumbnail.svg')
      })
    })

    describe('isDefaultThumbnail', () => {
      test('should return true for null thumbnail', () => {
        // Act
        const result = CourseAdapter.isDefaultThumbnail(null)

        // Assert
        expect(result).toBe(true)
      })

      test('should return true for default thumbnail URL', () => {
        // Act
        const result = CourseAdapter.isDefaultThumbnail('/images/default-course-thumbnail.svg')

        // Assert
        expect(result).toBe(true)
      })

      test('should return false for custom thumbnail', () => {
        // Act
        const result = CourseAdapter.isDefaultThumbnail('/custom-thumbnail.jpg')

        // Assert
        expect(result).toBe(false)
      })
    })

    describe('getDisplayThumbnail', () => {
      test('should return custom thumbnail when provided', () => {
        // Act
        const result = CourseAdapter.getDisplayThumbnail('/custom-thumbnail.jpg')

        // Assert
        expect(result).toBe('/custom-thumbnail.jpg')
      })

      test('should return default thumbnail when null provided', () => {
        // Act
        const result = CourseAdapter.getDisplayThumbnail(null)

        // Assert
        expect(result).toBe('/images/default-course-thumbnail.svg')
      })
    })
  })

  describe('fetchWithTimeoutWrapper', () => {
    test('should call fetchWithTimeout with correct parameters', async () => {
      // Arrange
      const mockResponse = { ok: true, json: async () => ({}) }
      mockFetch.mockResolvedValueOnce(mockResponse)

      // Act
      const result = await CourseAdapter.fetchWithTimeoutWrapper('/test', { method: 'GET' }, 5000)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/test', {
        method: 'GET',
        signal: expect.any(AbortSignal),
      })
      expect(result).toEqual(mockResponse)
    })
  })
})

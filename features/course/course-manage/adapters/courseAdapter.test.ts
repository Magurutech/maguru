// import { auth } from '@clerk/nextjs/server'
// import { Feature } from '@/features/homepage/component/Feature'
/**
 * Unit Test: CourseAdapter
 *
 * Test ini menguji semua method dalam CourseAdapter:
 * - getCourses: Mengambil daftar kursus dengan pagination
 * - getCourseById: Mengambil detail kursus berdasarkan ID
 * - createCourse: Membuat kursus baru
 * - updateCourse: Update metadata kursus
 * - deleteCourse: Hapus kursus
 * - getCoursesByCreator: Mengambil kursus berdasarkan creator
 * - updateCourseStatus: Update status kursus
 */

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock the module with getAuthHeader as jest.fn()
jest.mock('../../../../features/auth/services/getAuthHeader', () => ({
  getAuthHeader: jest.fn(),
}))

import { CourseAdapter } from './courseAdapter'
import { getAuthHeader } from '../../../../lib/getAuthHeader'

// Get the mocked function after import
const mockGetAuthHeader = getAuthHeader as jest.Mock

describe('CourseAdapter', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockGetAuthHeader.mockClear()
  })

  describe('getCourses', () => {
    test('should make successful GET request', async () => {
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
      })
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
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle 404 error', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Course not found' }),
      })

      // Act
      const result = await CourseAdapter.getCourseById('non-existent')

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Course not found',
      })
    })
  })

  describe('createCourse', () => {
    const validCourseData = {
      title: 'New Course',
      description: 'New Description',
      thumbnail: '/new-thumbnail.jpg',
      category: 'New Category',
    }

    test('should make successful POST request with auth', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')

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
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledWith('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
        body: JSON.stringify(validCourseData),
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle missing authentication', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue(null)

      // Act
      const result = await CourseAdapter.createCourse(validCourseData)

      // Assert
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        error: 'Authentication required. Please sign in to create a course.',
      })
    })

    test('should handle 401 Unauthorized from API', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue('Bearer invalid-token')

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid token' }),
      })

      // Act
      const result = await CourseAdapter.createCourse(validCourseData)

      // Assert
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        error: 'Authentication required. Please sign in.',
      })
    })

    test('should handle 403 Forbidden (role validation)', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue('Bearer user-token')

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Access denied' }),
      })

      // Act
      const result = await CourseAdapter.createCourse(validCourseData)

      // Assert
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        error: 'Access denied. Only creators and admins can create courses.',
      })
    })

    test('should handle 400 Bad Request (validation failed)', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')

      const invalidCourseData = {
        title: '', // Invalid: empty title
        description: 'New Description',
        category: 'New Category',
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Validation failed',
          details: [{ field: 'title', message: 'Judul kursus harus diisi' }],
        }),
      })

      // Act
      const result = await CourseAdapter.createCourse(invalidCourseData)

      // Assert
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        error: 'Validation failed',
      })
    })

    test('should handle network errors', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // Act
      const result = await CourseAdapter.createCourse(validCourseData)

      // Assert
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        error: 'Network error',
      })
    })
  })

  describe('updateCourse', () => {
    test('should make successful PUT request with auth', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')

      const courseData = {
        id: 'course-1',
        title: 'Updated Course',
        description: 'Updated Description',
        thumbnail: '/updated-thumbnail.jpg',
        category: 'Updated Category',
      }

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
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledWith('/api/courses/course-1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
        body: JSON.stringify(courseData),
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle missing authentication', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue(null)

      const courseData = {
        id: 'course-1',
        title: 'Updated Course',
        description: 'Updated Description',
        thumbnail: '/updated-thumbnail.jpg',
        category: 'Updated Category',
      }

      // Act
      const result = await CourseAdapter.updateCourse('course-1', courseData)

      // Assert
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        error: 'Authentication required. Please sign in to update a course.',
      })
    })

    test('should handle forbidden access', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')

      const courseData = {
        id: 'course-1',
        title: 'Updated Course',
        description: 'Updated Description',
        thumbnail: '/updated-thumbnail.jpg',
        category: 'Updated Category',
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Forbidden' }),
      })

      // Act
      const result = await CourseAdapter.updateCourse('course-1', courseData)

      // Assert
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        error: 'Access denied. Only course owners can update this course.',
      })
    })
  })

  describe('deleteCourse', () => {
    test('should make successful DELETE request with auth', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')

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
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledWith('/api/courses/course-1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle missing authentication', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue(null)

      // Act
      const result = await CourseAdapter.deleteCourse('course-1')

      // Assert
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        error: 'Authentication required. Please sign in to delete a course.',
      })
    })

    test('should handle server error', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error' }),
      })

      // Act
      const result = await CourseAdapter.deleteCourse('course-1')

      // Assert
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        error: 'Internal Server Error',
      })
    })
  })

  describe('getCoursesByCreator', () => {
    test('should make successful GET request with creatorId filter', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')

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
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledWith('/api/courses?page=1&limit=10&creatorId=creator-1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle missing authentication', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue(null)

      // Act
      const result = await CourseAdapter.getCoursesByCreator('creator-1', 1, 10)

      // Assert
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        error: 'Authentication required. Please sign in to view your courses.',
      })
    })
  })

  describe('updateCourseStatus', () => {
    test('should make successful PATCH request with auth', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')

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
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledWith('/api/courses/course-1/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      })
      expect(result).toEqual(mockResponse)
    })

    test('should handle missing authentication', async () => {
      // Arrange
      mockGetAuthHeader.mockResolvedValue(null)

      // Act
      const result = await CourseAdapter.updateCourseStatus('course-1', 'PUBLISHED')

      // Assert
      expect(mockGetAuthHeader).toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        error: 'Authentication required. Please sign in to update course status.',
      })
    })
  })
})

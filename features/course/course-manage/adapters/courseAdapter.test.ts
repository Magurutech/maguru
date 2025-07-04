/**
 * Unit Test: CourseAdapter
 *
 * Test ini mencakup semua operasi HTTP untuk CourseAdapter:
 * - getCourses: GET request untuk daftar kursus
 * - getCourseById: GET request untuk detail kursus
 * - createCourse: POST request untuk membuat kursus
 * - updateCourse: PUT request untuk update kursus
 * - deleteCourse: DELETE request untuk hapus kursus
 * - getCoursesByCreator: GET request dengan filter creator
 * - updateCourseStatus: PATCH request untuk update status
 *
 * Mengikuti prinsip TDD dan Designing for Failure dengan fokus pada:
 * - Network error handling
 * - API error responses
 * - Response parsing
 * - Retry mechanisms
 *
 * Mock Strategy:
 * - Menggunakan jest.fn() untuk mock fetch globally
 * - Test semua HTTP methods (GET, POST, PUT, DELETE, PATCH)
 * - Test error scenarios (network, 4xx, 5xx)
 * - Test success scenarios dengan proper response parsing
 */

import { CourseAdapter } from './courseAdapter'
import type { CreateCourseRequest, UpdateCourseRequest } from '../../types'

// Mock fetch globally
global.fetch = jest.fn()

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>

describe('CourseAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCourses', () => {
    const mockCoursesResponse = {
      success: true,
      data: {
        courses: [
          {
            id: 'course-1',
            title: 'Test Course',
            description: 'Test Description',
            thumbnail: '/test-thumbnail.jpg',
            category: 'Test Category',
            status: 'published',
            students: 100,
            lessons: 10,
            duration: '2 jam',
            rating: 4.5,
            creatorId: 'creator-1',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      },
    }

    it('should make successful GET request', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoursesResponse,
      } as Response)

      // Act
      const result = await CourseAdapter.getCourses(1, 10)

      // Assert
      expect(mockedFetch).toHaveBeenCalledWith('/api/courses?page=1&limit=10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(result).toEqual(mockCoursesResponse)
    })

    it('should handle network errors', async () => {
      // Arrange
      mockedFetch.mockRejectedValueOnce(new Error('Network error'))

      // Act
      const result = await CourseAdapter.getCourses(1, 10)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Network error',
      })
    })

    it('should handle API error responses', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad Request' }),
      } as Response)

      // Act
      const result = await CourseAdapter.getCourses(1, 10)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Bad Request',
      })
    })

    it('should handle empty response', async () => {
      // Arrange
      const emptyResponse = {
        success: true,
        data: {
          courses: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        },
      }
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyResponse,
      } as Response)

      // Act
      const result = await CourseAdapter.getCourses(1, 10)

      // Assert
      expect(result).toEqual(emptyResponse)
    })
  })

  describe('getCourseById', () => {
    const mockCourseResponse = {
      success: true,
      data: {
        id: 'course-1',
        title: 'Test Course',
        description: 'Test Description',
        thumbnail: '/test-thumbnail.jpg',
        category: 'Test Category',
        status: 'published',
        students: 100,
        lessons: 10,
        duration: '2 jam',
        rating: 4.5,
        creatorId: 'creator-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    }

    it('should make successful GET request', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourseResponse,
      } as Response)

      // Act
      const result = await CourseAdapter.getCourseById('course-1')

      // Assert
      expect(mockedFetch).toHaveBeenCalledWith('/api/courses/course-1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(result).toEqual(mockCourseResponse)
    })

    it('should handle 404 error', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Course not found' }),
      } as Response)

      // Act
      const result = await CourseAdapter.getCourseById('non-existent-id')

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Course not found',
      })
    })
  })

  describe('createCourse', () => {
    const mockCourseData: CreateCourseRequest = {
      title: 'New Course',
      description: 'New Description',
      thumbnail: '/new-thumbnail.jpg',
      category: 'New Category',
    }

    const mockCreatedResponse = {
      success: true,
      data: {
        id: 'course-2',
        title: 'New Course',
        description: 'New Description',
        thumbnail: '/new-thumbnail.jpg',
        category: 'New Category',
        status: 'draft',
        students: 0,
        lessons: 0,
        duration: '0 jam',
        rating: 0.0,
        creatorId: 'creator-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    }

    it('should make successful POST request', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatedResponse,
      } as Response)

      // Act
      const result = await CourseAdapter.createCourse(mockCourseData)

      // Assert
      expect(mockedFetch).toHaveBeenCalledWith('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockCourseData),
      })
      expect(result).toEqual(mockCreatedResponse)
    })

    it('should handle validation errors', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Validation failed' }),
      } as Response)

      // Act
      const result = await CourseAdapter.createCourse(mockCourseData)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Validation failed',
      })
    })

    it('should handle unauthorized access', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
      } as Response)

      // Act
      const result = await CourseAdapter.createCourse(mockCourseData)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Unauthorized',
      })
    })
  })

  describe('updateCourse', () => {
    const mockUpdateData: UpdateCourseRequest = {
      id: 'course-1',
      title: 'Updated Course',
      description: 'Updated Description',
      thumbnail: '/updated-thumbnail.jpg',
      category: 'Updated Category',
    }

    const mockUpdatedResponse = {
      success: true,
      data: {
        id: 'course-1',
        title: 'Updated Course',
        description: 'Updated Description',
        thumbnail: '/updated-thumbnail.jpg',
        category: 'Updated Category',
        status: 'published',
        students: 100,
        lessons: 10,
        duration: '2 jam',
        rating: 4.5,
        creatorId: 'creator-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    }

    it('should make successful PUT request', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedResponse,
      } as Response)

      // Act
      const result = await CourseAdapter.updateCourse('course-1', mockUpdateData)

      // Assert
      expect(mockedFetch).toHaveBeenCalledWith('/api/courses/course-1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockUpdateData),
      })
      expect(result).toEqual(mockUpdatedResponse)
    })

    it('should handle forbidden access', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Forbidden' }),
      } as Response)

      // Act
      const result = await CourseAdapter.updateCourse('course-1', mockUpdateData)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Forbidden',
      })
    })
  })

  describe('deleteCourse', () => {
    const mockDeleteResponse = {
      success: true,
      message: 'Course deleted successfully',
    }

    it('should make successful DELETE request', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDeleteResponse,
      } as Response)

      // Act
      const result = await CourseAdapter.deleteCourse('course-1')

      // Assert
      expect(mockedFetch).toHaveBeenCalledWith('/api/courses/course-1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(result).toEqual(mockDeleteResponse)
    })

    it('should handle server error', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error' }),
      } as Response)

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
    const mockCreatorResponse = {
      success: true,
      data: {
        courses: [
          {
            id: 'course-1',
            title: 'Creator Course',
            description: 'Creator Description',
            thumbnail: '/creator-thumbnail.jpg',
            category: 'Creator Category',
            status: 'published',
            students: 50,
            lessons: 5,
            duration: '1 jam',
            rating: 4.0,
            creatorId: 'creator-1',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      },
    }

    it('should make successful GET request with creatorId filter', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatorResponse,
      } as Response)

      // Act
      const result = await CourseAdapter.getCoursesByCreator('creator-1', 1, 10)

      // Assert
      expect(mockedFetch).toHaveBeenCalledWith('/api/courses?page=1&limit=10&creatorId=creator-1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(result).toEqual(mockCreatorResponse)
    })
  })

  describe('updateCourseStatus', () => {
    const mockStatusResponse = {
      success: true,
      data: {
        id: 'course-1',
        title: 'Test Course',
        description: 'Test Description',
        thumbnail: '/test-thumbnail.jpg',
        category: 'Test Category',
        status: 'published',
        students: 100,
        lessons: 10,
        duration: '2 jam',
        rating: 4.5,
        creatorId: 'creator-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    }

    it('should make successful PATCH request', async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatusResponse,
      } as Response)

      // Act
      const result = await CourseAdapter.updateCourseStatus('course-1', 'published')

      // Assert
      expect(mockedFetch).toHaveBeenCalledWith('/api/courses/course-1/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'published' }),
      })
      expect(result).toEqual(mockStatusResponse)
    })
  })
})

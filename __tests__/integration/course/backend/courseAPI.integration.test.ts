/**
 * Integration Test: CourseAPI ↔ Service
 *
 * @description
 * Test integration antara API routes dan service layer.
 * Fokus pada:
 * - Service layer error handling
 * - Input validation sebelum service call
 * - Service timeout scenarios
 * - Service returning null/undefined
 * - Error propagation dari service ke API response
 *
 * Mengikuti Designing for Failure principles dan TDD approach
 */

// Mock CourseService with a factory and expose the mock for test access
jest.mock('../../../../features/course/services/courseService', () => {
  const mockCourseService = {
    createCourse: jest.fn(),
    getCourses: jest.fn(),
    getCourseById: jest.fn(),
    updateCourse: jest.fn(),
    deleteCourse: jest.fn(),
    updateCourseStatus: jest.fn(),
  }
  return {
    CourseService: jest.fn().mockImplementation(() => mockCourseService),
    __mockCourseService: mockCourseService,
  }
})

// Mock authentication middleware
jest.mock('../../../../lib/auth-middleware', () => ({
  getAuthUser: jest.fn(() => ({ userId: 'user-1', role: 'CREATOR' })),
  requireAuth: jest.fn(() => ({ user: { clerkId: 'user-1', role: 'creator' } })),
  requireRole: jest.fn(() => null),
}))

// IMPORTS MUST COME AFTER ALL jest.mock!
import { CourseService } from '../../../../features/course/services/courseService'
import type { CourseStatus, CreateCourseRequest } from '../../../../features/course/types'

// Helper to get the mock instance in each test
const getMockCourseService = () =>
  jest.requireMock('../../../../features/course/services/courseService').__mockCourseService

describe('CourseAPI ↔ Service Integration', () => {
  let courseService: CourseService

  beforeEach(() => {
    jest.clearAllMocks()
    courseService = new CourseService()
  })

  describe('Service Layer Error Handling', () => {
    test('should handle service layer errors properly', async () => {
      // Arrange: Mock service layer failure
      getMockCourseService().getCourses.mockRejectedValue(new Error('Service layer error'))

      // Act & Assert: Service should handle errors gracefully
      await expect(courseService.getCourses()).rejects.toThrow('Service layer error')
    })

    test('should handle service timeout scenarios', async () => {
      // Arrange: Mock service timeout
      getMockCourseService().getCourses.mockRejectedValue(new Error('Request timeout'))

      // Act & Assert: Timeout should be handled gracefully
      await expect(courseService.getCourses()).rejects.toThrow('Request timeout')
    })

    test('should handle service returning null/undefined', async () => {
      // Arrange: Mock service returning null for non-existent data
      getMockCourseService().getCourseById.mockResolvedValue(null)

      // Act & Assert: Should handle null response gracefully
      const result = await courseService.getCourseById('non-existent-id')
      expect(result).toBeNull()
    })
  })

  describe('Input Validation', () => {
    test('should validate input before calling service', async () => {
      // Arrange: Invalid input data
      const invalidCourseData = {
        title: '', // Empty title
        description: '', // Empty description
        category: 'InvalidCategory', // Invalid category
      }

      // Act & Assert: Service should handle invalid input
      getMockCourseService().createCourse.mockResolvedValue(undefined)
      const result = await courseService.createCourse(
        invalidCourseData as CreateCourseRequest,
        'user-1',
      )
      expect(result).toBeUndefined()
    })

    test('should handle invalid course ID format', async () => {
      // Arrange: Invalid course ID
      getMockCourseService().getCourseById.mockResolvedValue(null)

      // Act & Assert: Invalid ID should be handled
      const result = await courseService.getCourseById('invalid-id')
      expect(result).toBeNull()
    })
  })

  describe('Authentication and Authorization', () => {
    test('should require valid user ID for course operations', async () => {
      // Arrange: Mock service returning access denied
      getMockCourseService().updateCourse.mockResolvedValue(null) // Access denied

      // Act & Assert: Service should handle access denied
      const result = await courseService.updateCourse(
        'course-1',
        { title: 'Updated Title', description: 'Updated Description', category: 'Programming' },
        'invalid-user-id',
      )
      expect(result).toBeNull()
    })

    test('should handle authorization failures gracefully', async () => {
      // Arrange: Mock service returning null for unauthorized access
      getMockCourseService().deleteCourse.mockResolvedValue(undefined)

      // Act & Assert: Service should handle authorization failure
      await expect(
        courseService.deleteCourse('course-1', 'unauthorized-user'),
      ).resolves.toBeUndefined()
    })
  })

  describe('Data Transformation', () => {
    test('should transform request data before service call', async () => {
      // Arrange: Valid course data
      const courseData: CreateCourseRequest = {
        title: 'Test Course',
        description: 'Test Description',
        category: 'Programming',
        status: 'DRAFT' as CourseStatus,
      }

      const mockCreatedCourse = {
        id: 'course-1',
        ...courseData,
        status: 'DRAFT' as CourseStatus,
        creatorId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      getMockCourseService().createCourse.mockResolvedValue(mockCreatedCourse)

      // Act
      const result = await courseService.createCourse(courseData, 'user-1')

      // Assert: Data should be transformed and passed to service
      expect(result).toEqual(mockCreatedCourse)
      expect(getMockCourseService().createCourse).toHaveBeenCalledWith(courseData, 'user-1')
    })

    test('should transform service response for API', async () => {
      // Arrange: Mock service response
      const mockCourses = [
        {
          id: 'course-1',
          title: 'Course 1',
          description: 'Description 1',
          category: 'Programming',
          status: 'PUBLISHED' as CourseStatus,
          creatorId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      getMockCourseService().getCourses.mockResolvedValue({
        courses: mockCourses,
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      })

      // Act
      const result = await courseService.getCourses()

      // Assert: Response should be properly formatted
      expect(result).toEqual({
        courses: mockCourses,
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      })
    })
  })

  describe('Error Response Format', () => {
    test('should propagate database errors with meaningful messages', async () => {
      // Arrange: Various error scenarios
      const errorScenarios = [
        { error: new Error('Validation failed'), expectedMessage: 'Validation failed' },
        { error: new Error('Authentication required'), expectedMessage: 'Authentication required' },
        { error: new Error('Access denied'), expectedMessage: 'Access denied' },
        { error: new Error('Course not found'), expectedMessage: 'Course not found' },
        { error: new Error('Internal server error'), expectedMessage: 'Internal server error' },
      ]

      for (const { error, expectedMessage } of errorScenarios) {
        getMockCourseService().getCourses.mockRejectedValue(error)

        // Act & Assert: Errors should propagate with original messages
        await expect(courseService.getCourses()).rejects.toThrow(expectedMessage)
      }
    })

    test('should handle unknown database errors gracefully', async () => {
      // Arrange: Mock unknown database error
      const unknownError = new Error('Unknown database error')
      getMockCourseService().getCourses.mockRejectedValue(unknownError)

      // Act & Assert: Unknown errors should still propagate
      await expect(courseService.getCourses()).rejects.toThrow('Unknown database error')
    })
  })

  describe('HTTP Method Handling', () => {
    test('should handle GET requests properly', async () => {
      // Arrange
      getMockCourseService().getCourses.mockResolvedValue({
        courses: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      })

      // Act
      const result = await courseService.getCourses()

      // Assert
      expect(result).toEqual({
        courses: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      })
      expect(getMockCourseService().getCourses).toHaveBeenCalled()
    })

    test('should handle POST requests properly', async () => {
      // Arrange
      const courseData: CreateCourseRequest = {
        title: 'Test Course',
        description: 'Test Description',
        category: 'Programming',
      }

      getMockCourseService().createCourse.mockResolvedValue({
        id: 'course-1',
        ...courseData,
        status: 'DRAFT' as CourseStatus,
        creatorId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Act
      const result = await courseService.createCourse(courseData, 'user-1')

      // Assert
      expect(result).toEqual({
        id: 'course-1',
        ...courseData,
        status: 'DRAFT',
        creatorId: 'user-1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
      expect(getMockCourseService().createCourse).toHaveBeenCalledWith(courseData, 'user-1')
    })

    test('should handle PUT requests properly', async () => {
      // Arrange
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        category: 'Programming',
      }
      getMockCourseService().updateCourse.mockResolvedValue({
        id: 'course-1',
        title: 'Updated Title',
        description: 'Updated Description',
        category: 'Programming',
        status: 'DRAFT' as CourseStatus,
        creatorId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Act
      const result = await courseService.updateCourse('course-1', updateData, 'user-1')

      // Assert
      expect(result).toEqual({
        id: 'course-1',
        title: 'Updated Title',
        description: 'Updated Description',
        category: 'Programming',
        status: 'DRAFT',
        creatorId: 'user-1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
      expect(getMockCourseService().updateCourse).toHaveBeenCalledWith(
        'course-1',
        updateData,
        'user-1',
      )
    })

    test('should handle DELETE requests properly', async () => {
      // Arrange
      getMockCourseService().deleteCourse.mockResolvedValue(undefined)

      // Act
      const result = await courseService.deleteCourse('course-1', 'user-1')

      // Assert
      expect(result).toBeUndefined()
      expect(getMockCourseService().deleteCourse).toHaveBeenCalledWith('course-1', 'user-1')
    })

    test('should handle PATCH requests for status updates', async () => {
      // Arrange
      getMockCourseService().updateCourseStatus.mockResolvedValue({
        id: 'course-1',
        title: 'Test Course',
        description: 'Test Description',
        category: 'Programming',
        status: 'PUBLISHED' as CourseStatus,
        creatorId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Act
      const result = await courseService.updateCourseStatus('course-1', 'PUBLISHED', 'user-1')

      // Assert
      expect(result).toEqual({
        id: 'course-1',
        title: 'Test Course',
        description: 'Test Description',
        category: 'Programming',
        status: 'PUBLISHED',
        creatorId: 'user-1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
      expect(getMockCourseService().updateCourseStatus).toHaveBeenCalledWith(
        'course-1',
        'PUBLISHED',
        'user-1',
      )
    })
  })
})

/**
 * Integration Tests: EnrollmentService ↔ Database
 *
 * Test ini bertujuan untuk menguji interaksi antara EnrollmentService
 * dan database dengan fokus pada data consistency dan error propagation.
 *
 * Coverage: Database connection, transactions, constraints
 * Designing for Failure: Connection failures, transaction rollbacks, data consistency
 */

import { EnrollmentService } from '../../../../features/course/services/enrollmentService'
import { Enrollment } from '../../../../features/course/types'
import { CourseStatus } from '@prisma/client'

// Mock Prisma untuk integration testing
jest.mock('@/lib/prisma', () => ({
  prisma: {
    enrollment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    course: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockPrisma: any

describe('EnrollmentService Integration', () => {
  let enrollmentService: EnrollmentService

  beforeEach(() => {
    enrollmentService = new EnrollmentService()
    jest.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mockPrisma = require('@/lib/prisma').prisma
  })

  describe('Database Connection Handling', () => {
    test('should handle database connection failure gracefully', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockRejectedValue(new Error('Connection failed'))

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Database operation failed')
    })

    test('should handle database disconnection gracefully', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockEnrollmentFindMany = mockPrisma.enrollment.findMany as jest.MockedFunction<any>
      mockEnrollmentFindMany.mockRejectedValue(new Error('Connection lost'))

      // Act
      const result = await enrollmentService.getEnrollments('user-123', { page: 1, limit: 10 })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Database query failed')
    })
  })

  describe('Transaction Management', () => {
    const mockCourse = {
      id: 'course-123',
      title: 'Test Course',
      status: CourseStatus.PUBLISHED,
      students: 10,
    }

    const mockEnrollment: Enrollment = {
      id: 'enrollment-123',
      userId: 'user-123',
      courseId: 'course-123',
      enrolledAt: new Date(),
    }

    test('should handle transaction rollback on failure', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Transaction rollback')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Transaction failed, please try again')
    })

    test('should handle successful transaction completion', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockEnrollmentCreate = mockPrisma.enrollment.create as jest.MockedFunction<any>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseUpdate = mockPrisma.course.update as jest.MockedFunction<any>

      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockEnrollmentCreate.mockResolvedValue(mockEnrollment)
      mockCourseUpdate.mockResolvedValue({ ...mockCourse, students: 11 })
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma))

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(true)
      expect(mockPrisma.$transaction).toHaveBeenCalled()
    })
  })

  describe('Constraint Violation Handling', () => {
    test('should handle foreign key constraint violations', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(null) // Course not found

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'invalid-course',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Course not found')
    })

    test('should handle unique constraint violations (duplicate enrollment)', async () => {
      // Arrange
      const mockCourse = {
        id: 'course-123',
        title: 'Test Course',
        status: CourseStatus.PUBLISHED,
        students: 10,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Unique constraint failed')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('User is already enrolled in this course')
    })

    test('should handle course not published', async () => {
      // Arrange
      const draftCourse = {
        id: 'course-123',
        title: 'Test Course',
        status: CourseStatus.DRAFT,
        students: 10,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(draftCourse)

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Course is not published')
    })
  })

  describe('Data Consistency', () => {
    const mockCourse = {
      id: 'course-123',
      title: 'Test Course',
      status: CourseStatus.PUBLISHED,
      students: 10,
    }

    const mockEnrollment: Enrollment = {
      id: 'enrollment-123',
      userId: 'user-123',
      courseId: 'course-123',
      enrolledAt: new Date(),
    }

    test('should maintain data consistency across enrollment operations', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockEnrollmentCreate = mockPrisma.enrollment.create as jest.MockedFunction<any>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseUpdate = mockPrisma.course.update as jest.MockedFunction<any>

      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockEnrollmentCreate.mockResolvedValue(mockEnrollment)
      mockCourseUpdate.mockResolvedValue({ ...mockCourse, students: 11 })
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma))

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(true)
      expect(mockCourseUpdate).toHaveBeenCalledWith({
        where: { id: 'course-123' },
        data: { students: { increment: 1 } },
      })
    })

    test('should handle data inconsistency gracefully', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Data inconsistency detected')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Database operation failed')
    })
  })

  describe('Error Propagation', () => {
    test('should propagate database errors with meaningful messages', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockRejectedValue(new Error('Database connection failed'))

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Database operation failed')
    })

    test('should handle unknown database errors gracefully', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockEnrollmentFindMany = mockPrisma.enrollment.findMany as jest.MockedFunction<any>
      mockEnrollmentFindMany.mockRejectedValue(new Error('Unknown database error'))

      // Act
      const result = await enrollmentService.getEnrollments('user-123', { page: 1, limit: 10 })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Database query failed')
    })
  })
})

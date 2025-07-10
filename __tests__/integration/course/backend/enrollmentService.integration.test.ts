/**
 * Integration Tests: EnrollmentService ↔ Database
 *
 * Test ini bertujuan untuk menguji interaksi antara EnrollmentService
 * dan database dengan fokus pada data consistency dan error propagation.
 *
 * Coverage: Database connection, transactions, concurrent access, constraints
 * Designing for Failure: Connection failures, transaction rollbacks, data consistency
 */

import { EnrollmentService } from '../../../../features/course/services/enrollmentService'
import { Enrollment } from '../../../../features/course/types'
import { CourseStatus } from '@prisma/client'

// Mock Prisma untuk integration testing - Fix path to match service import
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
    // ✅ SOLUSI: Akses mock yang benar dari jest.mock()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mockPrisma = require('@/lib/prisma').prisma
  })

  describe('Database Connection Handling', () => {
    it('should handle database connection failure gracefully', async () => {
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
      expect(result.error).toContain('Database operation failed')
    })

    it('should handle database disconnection gracefully', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockEnrollmentFindMany = mockPrisma.enrollment.findMany as jest.MockedFunction<any>
      mockEnrollmentFindMany.mockRejectedValue(new Error('Connection lost'))

      // Act
      const result = await enrollmentService.getEnrollments('user-123', { page: 1, limit: 10 })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Database query failed')
    })

    it('should handle connection timeout scenarios', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockEnrollmentFindUnique = mockPrisma.enrollment.findUnique as jest.MockedFunction<any>
      mockEnrollmentFindUnique.mockRejectedValue(new Error('Connection timeout'))

      // Act
      const result = await enrollmentService.getEnrollmentStatus('user-123', 'course-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Database query failed')
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

    it('should handle transaction rollback on partial failure', async () => {
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
      expect(result.error).toContain('Transaction failed, please try again')
    })

    it('should handle successful transaction completion', async () => {
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

    it('should handle concurrent transaction conflicts', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Concurrent transaction conflict')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Transaction failed, please try again')
    })

    it('should handle transaction timeout scenarios', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Transaction timeout')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Transaction failed, please try again')
    })
  })

  describe('Concurrent Access Handling', () => {
    const mockCourse = {
      id: 'course-123',
      title: 'Test Course',
      status: CourseStatus.PUBLISHED,
      students: 10,
    }

    it('should handle concurrent enrollment to same course', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Concurrent enrollment detected')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Concurrent modification detected, please try again')
    })

    it('should handle concurrent enrollment conflicts', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Unique constraint violation')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('already enrolled')
    })

    it('should handle race conditions in student count updates', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Race condition in student count')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Concurrent modification detected, please try again')
    })

    it('should handle database lock scenarios', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Database lock timeout')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Database operation failed')
    })
  })

  describe('Constraint Violation Handling', () => {
    it('should handle foreign key constraint violations', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(null) // Course not found
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Foreign key constraint failed')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'invalid-course',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should handle unique constraint violations (duplicate enrollment)', async () => {
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
      expect(result.error).toContain('already enrolled')
    })

    it('should handle not null constraint violations', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(null)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('NOT NULL constraint failed')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', { courseId: '' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid course ID provided')
    })

    it('should handle check constraint violations', async () => {
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
      expect(result.error).toContain('not published')
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

    it('should maintain data consistency across enrollment operations', async () => {
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

    it('should handle data inconsistency gracefully', async () => {
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
      expect(result.error).toContain('Database operation failed')
    })

    it('should verify course.students count accuracy', async () => {
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
      expect(mockCourseUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { students: { increment: 1 } },
        }),
      )
    })

    it('should handle partial enrollment failures', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCourseFindUnique = mockPrisma.course.findUnique as jest.MockedFunction<any>
      mockCourseFindUnique.mockResolvedValue(mockCourse)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Partial enrollment failure')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', {
        courseId: 'course-123',
      })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Transaction failed, please try again')
    })
  })

  describe('Error Propagation', () => {
    it('should propagate database errors with meaningful messages', async () => {
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
      expect(result.error).toContain('Database operation failed')
    })

    it('should handle unknown database errors gracefully', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockEnrollmentFindMany = mockPrisma.enrollment.findMany as jest.MockedFunction<any>
      mockEnrollmentFindMany.mockRejectedValue(new Error('Unknown database error'))

      // Act
      const result = await enrollmentService.getEnrollments('user-123', { page: 1, limit: 10 })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Database query failed')
    })


  })
})

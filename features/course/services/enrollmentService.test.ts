/**
 * Unit Tests: EnrollmentService
 *
 * Test ini bertujuan untuk menguji business logic dan database operations
 * untuk enrollment service dengan pendekatan TDD dan designing for failure.
 *
 * Coverage Target: ≥ 90% untuk semua enrollment operations
 * Error Scenarios: Database errors, validation errors, concurrent access
 * Designing for Failure: Retry logic, timeout handling, graceful degradation
 */

import { EnrollmentService } from './enrollmentService'
import { CreateEnrollmentRequest, Enrollment, CourseStatus } from '../types'

// Mock Prisma - Fix path to match service import
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

describe('EnrollmentService', () => {
  let enrollmentService: EnrollmentService
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPrisma: any

  beforeEach(() => {
    enrollmentService = new EnrollmentService()
    jest.clearAllMocks()
    // ✅ SOLUSI: Akses mock yang benar dari jest.mock()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mockPrisma = require('@/lib/prisma').prisma
  })

  describe('createEnrollment', () => {
    const mockRequest: CreateEnrollmentRequest = {
      courseId: 'course-123',
    }

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

    it('should create enrollment successfully with valid data', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.course.findUnique.mockResolvedValue(mockCourse as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.enrollment.create.mockResolvedValue(mockEnrollment as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.course.update.mockResolvedValue({ ...mockCourse, students: 11 } as any)
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma))

      // Act
      const result = await enrollmentService.createEnrollment('user-123', mockRequest)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockEnrollment)
      expect(mockPrisma.course.findUnique).toHaveBeenCalledWith({
        where: { id: 'course-123' },
      })
      expect(mockPrisma.enrollment.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          courseId: 'course-123',
        },
        include: { course: true },
      })
      expect(mockPrisma.course.update).toHaveBeenCalledWith({
        where: { id: 'course-123' },
        data: { students: { increment: 1 } },
      })
    })

    it('should handle duplicate enrollment error (409 Conflict)', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.course.findUnique.mockResolvedValue(mockCourse as any)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Unique constraint failed')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', mockRequest)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('already enrolled')
    })

    it('should handle course not found error (404 Not Found)', async () => {
      // Arrange
      mockPrisma.course.findUnique.mockResolvedValue(null)

      // Act
      const result = await enrollmentService.createEnrollment('user-123', mockRequest)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should handle course not published error (400 Bad Request)', async () => {
      // Arrange
      const draftCourse = { ...mockCourse, status: CourseStatus.DRAFT }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.course.findUnique.mockResolvedValue(draftCourse as any)

      // Act
      const result = await enrollmentService.createEnrollment('user-123', mockRequest)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('not published')
    })

    it('should handle database connection error', async () => {
      // Arrange
      mockPrisma.course.findUnique.mockRejectedValue(new Error('Database connection failed'))

      // Act
      const result = await enrollmentService.createEnrollment('user-123', mockRequest)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Database operation failed')
    })

    it('should handle invalid course ID format', async () => {
      // Arrange
      const invalidRequest = { courseId: '' }

      // Act
      const result = await enrollmentService.createEnrollment('user-123', invalidRequest)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid course ID provided')
    })

    it('should handle atomic transaction failure', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.course.findUnique.mockResolvedValue(mockCourse as any)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Transaction failed')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', mockRequest)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Transaction failed, please try again')
    })

    it('should handle concurrent enrollment attempts', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.course.findUnique.mockResolvedValue(mockCourse as any)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Concurrent modification')
      })

      // Act
      const result = await enrollmentService.createEnrollment('user-123', mockRequest)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Concurrent modification detected, please try again')
    })
  })

  describe('getEnrollments', () => {
    const mockEnrollments = [
      {
        id: 'enrollment-1',
        userId: 'user-123',
        courseId: 'course-1',
        enrolledAt: new Date(),
        course: { id: 'course-1', title: 'Course 1' },
      },
      {
        id: 'enrollment-2',
        userId: 'user-123',
        courseId: 'course-2',
        enrolledAt: new Date(),
        course: { id: 'course-2', title: 'Course 2' },
      },
    ]

    it('should return paginated enrollments list', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.enrollment.findMany.mockResolvedValue(mockEnrollments as any)
      mockPrisma.enrollment.count.mockResolvedValue(2)

      // Act
      const result = await enrollmentService.getEnrollments('user-123', { page: 1, limit: 10 })

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(mockPrisma.enrollment.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        include: { course: true },
        skip: 0,
        take: 10,
        orderBy: { enrolledAt: 'desc' },
      })
    })

    it('should filter by userId correctly', async () => {
      // Arrange
      mockPrisma.enrollment.findMany.mockResolvedValue([])

      // Act
      await enrollmentService.getEnrollments('user-456', { page: 1, limit: 10 })

      // Assert
      expect(mockPrisma.enrollment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-456' },
        }),
      )
    })

    it('should handle empty database', async () => {
      // Arrange
      mockPrisma.enrollment.findMany.mockResolvedValue([])
      mockPrisma.enrollment.count.mockResolvedValue(0)

      // Act
      const result = await enrollmentService.getEnrollments('user-123', { page: 1, limit: 10 })

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(0)
    })

    it('should handle invalid pagination parameters', async () => {
      // Arrange
      mockPrisma.enrollment.findMany.mockResolvedValue([])
      mockPrisma.enrollment.count.mockResolvedValue(0)

      // Act
      const result = await enrollmentService.getEnrollments('user-123', { page: -1, limit: 0 })

      // Assert
      expect(result.success).toBe(true)
      expect(mockPrisma.enrollment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 1, // Normalized limit (Math.max(1, Math.min(100, 0)) = 1)
        }),
      )
    })

    it('should handle database query error', async () => {
      // Arrange
      mockPrisma.enrollment.findMany.mockRejectedValue(new Error('Database query failed'))

      // Act
      const result = await enrollmentService.getEnrollments('user-123', { page: 1, limit: 10 })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Database query failed')
    })
  })

  describe('getEnrollmentStatus', () => {
    const mockEnrollment = {
      id: 'enrollment-123',
      userId: 'user-123',
      courseId: 'course-123',
      enrolledAt: new Date('2024-01-01'),
    }

    it('should return true for enrolled user', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.enrollment.findUnique.mockResolvedValue(mockEnrollment as any)

      // Act
      const result = await enrollmentService.getEnrollmentStatus('user-123', 'course-123')

      // Assert
      expect(result.success).toBe(true)
      expect(result.isEnrolled).toBe(true)
      expect(result.enrollmentDate).toEqual(mockEnrollment.enrolledAt)
    })

    it('should return false for non-enrolled user', async () => {
      // Arrange
      mockPrisma.enrollment.findUnique.mockResolvedValue(null)

      // Act
      const result = await enrollmentService.getEnrollmentStatus('user-123', 'course-123')

      // Assert
      expect(result.success).toBe(true)
      expect(result.isEnrolled).toBe(false)
      expect(result.enrollmentDate).toBeUndefined()
    })

    it('should handle course not found', async () => {
      // Arrange
      mockPrisma.enrollment.findUnique.mockResolvedValue(null)

      // Act
      const result = await enrollmentService.getEnrollmentStatus('user-123', 'invalid-course')

      // Assert
      expect(result.success).toBe(true)
      expect(result.isEnrolled).toBe(false)
    })

    it('should handle database query error', async () => {
      // Arrange
      mockPrisma.enrollment.findUnique.mockRejectedValue(new Error('Database query failed'))

      // Act
      const result = await enrollmentService.getEnrollmentStatus('user-123', 'course-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Database query failed')
    })
  })

  describe('deleteEnrollment', () => {
    const mockEnrollment = {
      id: 'enrollment-123',
      userId: 'user-123',
      courseId: 'course-123',
      enrolledAt: new Date(),
    }

    it('should delete enrollment successfully', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.enrollment.findUnique.mockResolvedValue(mockEnrollment as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.enrollment.delete.mockResolvedValue(mockEnrollment as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.course.update.mockResolvedValue({ students: 9 } as any)
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma))

      // Act
      const result = await enrollmentService.deleteEnrollment('user-123', 'enrollment-123')

      // Assert
      expect(result.success).toBe(true)
      expect(mockPrisma.enrollment.delete).toHaveBeenCalledWith({
        where: { id: 'enrollment-123' },
      })
      expect(mockPrisma.course.update).toHaveBeenCalledWith({
        where: { id: 'course-123' },
        data: { students: { decrement: 1 } },
      })
    })

    it('should handle enrollment not found', async () => {
      // Arrange
      mockPrisma.enrollment.findUnique.mockResolvedValue(null)

      // Act
      const result = await enrollmentService.deleteEnrollment('user-123', 'enrollment-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should handle unauthorized deletion', async () => {
      // Arrange
      const otherUserEnrollment = { ...mockEnrollment, userId: 'user-456' }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.enrollment.findUnique.mockResolvedValue(otherUserEnrollment as any)

      // Act
      const result = await enrollmentService.deleteEnrollment('user-123', 'enrollment-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Unauthorized to delete this enrollment')
    })

    it('should handle database transaction error', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.enrollment.findUnique.mockResolvedValue(mockEnrollment as any)
      mockPrisma.$transaction.mockImplementation(() => {
        throw new Error('Transaction failed')
      })

      // Act
      const result = await enrollmentService.deleteEnrollment('user-123', 'enrollment-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Transaction failed, please try again')
    })
  })
})

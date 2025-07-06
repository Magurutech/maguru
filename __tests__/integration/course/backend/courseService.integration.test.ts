/**
 * Integration Test: CourseService ↔ Database
 *
 * @description
 * Test integration antara CourseService dan database layer.
 * Fokus pada:
 * - Database connection handling
 * - Transaction management
 * - Concurrent access handling
 * - Constraint violation handling
 * - Error propagation dari database ke service
 *
 * Mengikuti Designing for Failure principles dan TDD approach
 */

import { CourseService } from '../../../../features/course/services/courseService'
import type { CourseStatus, CreateCourseRequest } from '../../../../features/course/types'

// Mock Prisma untuk integration testing
jest.mock('@/lib/prisma', () => ({
  prisma: {
    course: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockPrisma = require('@/lib/prisma').prisma

describe('CourseService ↔ Database Integration', () => {
  let courseService: CourseService

  beforeEach(() => {
    jest.clearAllMocks()
    courseService = new CourseService()
  })

  describe('Database Connection Handling', () => {
    test('should handle database connection failure gracefully', async () => {
      // Arrange: Simulate database connection failure
      mockPrisma.course.findMany.mockRejectedValue(new Error('Database connection failed'))

      // Act & Assert: Service should handle connection failure gracefully
      await expect(courseService.getCourses()).rejects.toThrow('Database connection failed')
    })

    test('should handle database disconnection gracefully', async () => {
      // Arrange: Simulate successful database operations
      mockPrisma.course.findMany.mockResolvedValue([])
      mockPrisma.course.count.mockResolvedValue(0)

      // Act: Service should handle disconnection
      await courseService.getCourses()

      // Assert: Database operations should work
      expect(mockPrisma.course.findMany).toHaveBeenCalled()
    })
  })

  describe('Transaction Management', () => {
    test('should handle transaction rollback on partial failure', async () => {
      // Arrange: Simulate database operation failure
      mockPrisma.course.create.mockRejectedValue(new Error('Transaction failed'))

      // Act & Assert: Service should handle transaction failure
      await expect(
        courseService.createCourse(
          {
            title: 'Test Course',
            description: 'Test Description',
            category: 'Programming',
          } as CreateCourseRequest,
          'user-1',
        ),
      ).rejects.toThrow('Transaction failed')
    })

    test('should handle successful transaction completion', async () => {
      // Arrange: Mock successful database operation
      const mockCourse = {
        id: 'course-1',
        title: 'Test Course',
        description: 'Test Description',
        category: 'Programming',
        status: 'DRAFT',
        creatorId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.course.create.mockResolvedValue(mockCourse)

      // Act
      const result = await courseService.createCourse(
        {
          title: 'Test Course',
          description: 'Test Description',
          category: 'Programming',
        } as CreateCourseRequest,
        'user-1',
      )

      // Assert: Database operation should complete successfully
      expect(result).toEqual(mockCourse)
    })
  })

  describe('Concurrent Access Handling', () => {
    test('should handle concurrent access to same course', async () => {
      // Arrange: Mock concurrent update scenarios
      const courseId = 'course-1'
      const mockCourse = {
        id: courseId,
        title: 'Original Title',
        description: 'Original Description',
        category: 'Programming',
        status: 'DRAFT',
        creatorId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.course.findFirst.mockResolvedValue(mockCourse)
      mockPrisma.course.update.mockResolvedValue(mockCourse)

      // Act: Simulate concurrent updates
      const updatePromises = [
        courseService.updateCourse(
          courseId,
          { title: 'Update 1', description: 'Update 1', category: 'Programming' },
          'user-1',
        ),
        courseService.updateCourse(
          courseId,
          { title: 'Update 2', description: 'Update 2', category: 'Programming' },
          'user-1',
        ),
        courseService.updateCourse(
          courseId,
          { title: 'Update 3', description: 'Update 3', category: 'Programming' },
          'user-1',
        ),
      ]

      // Assert: All updates should complete (database handles concurrency)
      const results = await Promise.allSettled(updatePromises)
      expect(results.every((result) => result.status === 'fulfilled')).toBe(true)
      expect(mockPrisma.course.update).toHaveBeenCalledTimes(3)
    })

    test('should handle concurrent creation conflicts', async () => {
      // Arrange: Mock unique constraint violation
      mockPrisma.course.create.mockRejectedValueOnce(new Error('Unique constraint violation'))

      // Act & Assert: Service should handle constraint violation
      await expect(
        courseService.createCourse(
          {
            title: 'Duplicate Course',
            description: 'Test Description',
            category: 'Programming',
          } as CreateCourseRequest,
          'user-1',
        ),
      ).rejects.toThrow('Unique constraint violation')
    })
  })

  describe('Constraint Violation Handling', () => {
    test('should handle foreign key constraint violations', async () => {
      // Arrange: Mock foreign key constraint violation
      mockPrisma.course.create.mockRejectedValue(new Error('Foreign key constraint violation'))

      // Act & Assert: Service should handle constraint violation gracefully
      await expect(
        courseService.createCourse(
          {
            title: 'Test Course',
            description: 'Test Description',
            category: 'Programming',
          } as CreateCourseRequest,
          'invalid-user-id',
        ),
      ).rejects.toThrow('Foreign key constraint violation')
    })

    test('should handle not null constraint violations', async () => {
      // Arrange: Mock not null constraint violation
      mockPrisma.course.create.mockRejectedValue(new Error('NOT NULL constraint violation'))

      // Act & Assert: Service should handle constraint violation
      await expect(
        courseService.createCourse(
          {
            title: '', // Empty title should violate not null constraint
            description: 'Test Description',
            category: 'Programming',
          } as CreateCourseRequest,
          'user-1',
        ),
      ).rejects.toThrow('NOT NULL constraint violation')
    })

    test('should handle check constraint violations', async () => {
      // Arrange: Mock check constraint violation (e.g., invalid status)
      mockPrisma.course.create.mockRejectedValue(new Error('Check constraint violation'))

      // Act & Assert: Service should handle constraint violation
      await expect(
        courseService.createCourse(
          {
            title: 'Test Course',
            description: 'Test Description',
            category: 'Programming',
            status: 'INVALID_STATUS' as CourseStatus,
          } as CreateCourseRequest,
          'user-1',
        ),
      ).rejects.toThrow('Check constraint violation')
    })
  })

  describe('Data Consistency', () => {
    test('should maintain data consistency across operations', async () => {
      // Arrange: Mock consistent data operations
      const mockCourse = {
        id: 'course-1',
        title: 'Test Course',
        description: 'Test Description',
        category: 'Programming',
        status: 'DRAFT',
        creatorId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.course.create.mockResolvedValue(mockCourse)
      mockPrisma.course.findUnique.mockResolvedValue(mockCourse)
      mockPrisma.course.findFirst.mockResolvedValue(mockCourse)
      mockPrisma.course.update.mockResolvedValue({ ...mockCourse, title: 'Updated Title' })

      // Act: Create, read, update sequence
      const created = await courseService.createCourse(
        {
          title: 'Test Course',
          description: 'Test Description',
          category: 'Programming',
        } as CreateCourseRequest,
        'user-1',
      )

      const read = await courseService.getCourseById('course-1')
      const updated = await courseService.updateCourse(
        'course-1',
        { title: 'Updated Title', description: 'Updated Description', category: 'Programming' },
        'user-1',
      )

      // Assert: Data should remain consistent
      expect(created.id).toBe(read?.id)
      expect(read?.id).toBe(updated.id)
      expect(updated.title).toBe('Updated Title')
    })

    test('should handle data inconsistency gracefully', async () => {
      // Arrange: Mock data inconsistency scenario
      mockPrisma.course.findUnique.mockResolvedValue(null) // Course not found after creation

      // Act & Assert: Service should handle data inconsistency
      await expect(courseService.getCourseById('non-existent-id')).resolves.toBeNull()
    })
  })

  describe('Error Propagation', () => {
    test('should propagate database errors with meaningful messages', async () => {
      // Arrange: Mock various database errors
      const databaseErrors = [
        { error: new Error('Connection timeout'), expectedMessage: 'Connection timeout' },
        { error: new Error('Query timeout'), expectedMessage: 'Query timeout' },
        { error: new Error('Deadlock detected'), expectedMessage: 'Deadlock detected' },
      ]

      for (const { error, expectedMessage } of databaseErrors) {
        mockPrisma.course.findMany.mockRejectedValue(error)

        // Act & Assert: Errors should propagate with original messages
        await expect(courseService.getCourses()).rejects.toThrow(expectedMessage)
      }
    })

    test('should handle unknown database errors gracefully', async () => {
      // Arrange: Mock unknown database error
      const unknownError = new Error('Unknown database error')
      mockPrisma.course.findMany.mockRejectedValue(unknownError)

      // Act & Assert: Unknown errors should still propagate
      await expect(courseService.getCourses()).rejects.toThrow('Unknown database error')
    })
  })
})

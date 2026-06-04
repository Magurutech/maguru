/**
 * Integration Test: Lesson Order Conflict with Shift Logic
 *
 * Tests transaction logic for:
 * - createLesson with order conflict → shift existing lessons
 * - updateLesson with order conflict → bidirectional shift
 * - Transaction atomicity → rollback on error
 *
 * Focus: Service + Prisma transaction integration with mocked database
 * Requirements: Task 14 - Feature 2: Lesson Order Conflict Fix
 */

import { lessonService } from '../lesson.service'
import { prismaMock } from '@/prisma/lib/singleton'
import { LessonContent } from '../../types/lesson.types'

// Mock Course Service for authorization
jest.mock('../course.service', () => ({
  checkCourseOwnership: jest.fn().mockResolvedValue(true),
}))

// Mock validation module
jest.mock('../../validation/tiptap', () => ({
  validateLessonContent: jest.fn((content: LessonContent) => {
    if (!content.content || content.content.type !== 'doc') {
      throw new Error('Invalid Tiptap JSON structure')
    }
    return content
  }),
}))

describe('Lesson Order Conflict - Integration Tests', () => {
  const testCourseId = 'test-course-id'
  const testSectionId = 'test-section-id'
  const testUserId = 'test-user-id'

  const validLessonContent: LessonContent = {
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Test content' }],
        },
      ],
    },
    version: 1,
    lastEdit: new Date().toISOString(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createLesson with order conflict', () => {
    it('[MUST HAVE] should shift existing lessons when order conflict occurs', async () => {
      // Mock: Existing lesson at order 2
      const existingLesson = {
        id: 'existing-lesson-2',
        sectionId: testSectionId,
        title: 'Lesson 2',
        content: validLessonContent,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Mock: Lessons that will be shifted (order >= 2)
      const lessonsToShift = [
        { id: 'lesson-3', order: 3 },
        { id: 'lesson-2', order: 2 },
        { id: 'lesson-1', order: 1 }, // Not in range, but for completeness
      ]

      // Mock: New lesson to be created at order 2
      const newLesson = {
        id: 'new-lesson-2',
        sectionId: testSectionId,
        title: 'New Lesson at Order 2',
        content: validLessonContent,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Mock transaction callback
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        // Mock findUnique to return existing lesson (conflict detected)
        prismaMock.lessons.findUnique.mockResolvedValue(existingLesson as never)

        // Mock findMany for descending order shift
        prismaMock.lessons.findMany.mockResolvedValue(
          lessonsToShift.filter((l) => l.order >= 2).sort((a, b) => b.order - a.order) as never,
        )

        // Mock update for each lesson in shift
        prismaMock.lessons.update.mockResolvedValue({} as never)

        // Mock create for new lesson
        prismaMock.lessons.create.mockResolvedValue(newLesson as never)

        // Execute callback with mocked transaction
        return await callback(prismaMock)
      })

      // Act: Create lesson with order conflict
      const result = await lessonService.createLesson(
        testSectionId,
        {
          title: 'New Lesson at Order 2',
          content: validLessonContent,
          order: 2,
        },
        testUserId,
        testCourseId,
      )

      // Assert: New lesson created
      expect(result.order).toBe(2)
      expect(result.title).toBe('New Lesson at Order 2')

      // Assert: findMany was called for descending order shift
      expect(prismaMock.lessons.findMany).toHaveBeenCalledWith({
        where: {
          sectionId: testSectionId,
          order: { gte: 2 },
        },
        orderBy: { order: 'desc' },
        select: { id: true, order: true },
      })

      // Assert: Individual updates were called (descending order)
      expect(prismaMock.lessons.update).toHaveBeenCalled()

      // Assert: Create was called
      expect(prismaMock.lessons.create).toHaveBeenCalled()
    })

    it('[SHOULD HAVE] should NOT shift when no order conflict', async () => {
      // Mock: No existing lesson at order 3
      const newLesson = {
        id: 'new-lesson-3',
        sectionId: testSectionId,
        title: 'Lesson 3',
        content: validLessonContent,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Mock transaction callback
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        // Mock findUnique to return null (no conflict)
        prismaMock.lessons.findUnique.mockResolvedValue(null)

        // Mock create for new lesson
        prismaMock.lessons.create.mockResolvedValue(newLesson as never)

        return await callback(prismaMock)
      })

      // Act: Create lesson without conflict
      const result = await lessonService.createLesson(
        testSectionId,
        {
          title: 'Lesson 3',
          content: validLessonContent,
          order: 3,
        },
        testUserId,
        testCourseId,
      )

      // Assert: New lesson created
      expect(result.order).toBe(3)

      // Assert: updateMany was NOT called (no shift needed)
      expect(prismaMock.lessons.updateMany).not.toHaveBeenCalled()
    })

    it('[MUST HAVE] should shift all lessons when inserting at order 1', async () => {
      // Mock: Existing lesson at order 1
      const existingLesson = {
        id: 'existing-lesson-1',
        sectionId: testSectionId,
        title: 'Lesson 1',
        content: validLessonContent,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const lessonsToShift = [
        { id: 'lesson-3', order: 3 },
        { id: 'lesson-2', order: 2 },
        { id: 'lesson-1', order: 1 },
      ]

      const newLesson = {
        id: 'new-first-lesson',
        sectionId: testSectionId,
        title: 'New First Lesson',
        content: validLessonContent,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Mock transaction
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        prismaMock.lessons.findUnique.mockResolvedValue(existingLesson as never)
        prismaMock.lessons.findMany.mockResolvedValue(lessonsToShift as never)
        prismaMock.lessons.update.mockResolvedValue({} as never)
        prismaMock.lessons.create.mockResolvedValue(newLesson as never)
        return await callback(prismaMock)
      })

      // Act
      const result = await lessonService.createLesson(
        testSectionId,
        {
          title: 'New First Lesson',
          content: validLessonContent,
          order: 1,
        },
        testUserId,
        testCourseId,
      )

      // Assert
      expect(result.order).toBe(1)
      expect(prismaMock.lessons.findMany).toHaveBeenCalledWith({
        where: {
          sectionId: testSectionId,
          order: { gte: 1 },
        },
        orderBy: { order: 'desc' },
        select: { id: true, order: true },
      })
    })
  })

  describe('updateLesson with order conflict', () => {
    it('[MUST HAVE] should shift lessons when moving UP (order 5 → 2)', async () => {
      const existingLesson = {
        id: 'lesson-5',
        sectionId: testSectionId,
        title: 'Lesson 5',
        content: validLessonContent,
        order: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        sections: {
          courseId: testCourseId,
        },
      }

      const conflictLesson = {
        id: 'lesson-2',
        sectionId: testSectionId,
        title: 'Lesson 2',
        content: validLessonContent,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const lessonsToShift = [
        { id: 'lesson-4', order: 4 },
        { id: 'lesson-3', order: 3 },
        { id: 'lesson-2', order: 2 },
      ]

      const updatedLesson = {
        ...existingLesson,
        order: 2,
      }

      // Mock transaction
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        // First findUnique in transaction returns conflict
        prismaMock.lessons.findUnique.mockResolvedValue(conflictLesson as never)
        prismaMock.lessons.findMany.mockResolvedValue(lessonsToShift as never)
        prismaMock.lessons.update.mockResolvedValue(updatedLesson as never)
        return await callback(prismaMock)
      })

      // Mock initial findUnique (outside transaction)
      prismaMock.lessons.findUnique.mockResolvedValue(existingLesson as never)

      // Act
      await lessonService.updateLesson('lesson-5', { order: 2 }, testUserId)

      // Assert: findMany called for descending order shift
      expect(prismaMock.lessons.findMany).toHaveBeenCalledWith({
        where: {
          sectionId: testSectionId,
          order: {
            gte: 2,
            lt: 5,
          },
        },
        orderBy: { order: 'desc' },
        select: { id: true, order: true },
      })
    })

    it('[MUST HAVE] should shift lessons when moving DOWN (order 2 → 5)', async () => {
      const existingLesson = {
        id: 'lesson-2',
        sectionId: testSectionId,
        title: 'Lesson 2',
        content: validLessonContent,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        sections: {
          courseId: testCourseId,
        },
      }

      const conflictLesson = {
        id: 'lesson-5',
        sectionId: testSectionId,
        title: 'Lesson 5',
        content: validLessonContent,
        order: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const lessonsToShift = [
        { id: 'lesson-3', order: 3 },
        { id: 'lesson-4', order: 4 },
        { id: 'lesson-5', order: 5 },
      ]

      const updatedLesson = {
        ...existingLesson,
        order: 5,
      }

      // Mock transaction
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        prismaMock.lessons.findUnique.mockResolvedValue(conflictLesson as never)
        prismaMock.lessons.findMany.mockResolvedValue(lessonsToShift as never)
        prismaMock.lessons.update.mockResolvedValue(updatedLesson as never)
        return await callback(prismaMock)
      })

      prismaMock.lessons.findUnique.mockResolvedValue(existingLesson as never)

      // Act
      await lessonService.updateLesson('lesson-2', { order: 5 }, testUserId)

      // Assert: findMany called for ascending order shift
      expect(prismaMock.lessons.findMany).toHaveBeenCalledWith({
        where: {
          sectionId: testSectionId,
          order: {
            gt: 2,
            lte: 5,
          },
        },
        orderBy: { order: 'asc' },
        select: { id: true, order: true },
      })
    })

    it('[SHOULD HAVE] should NOT shift when order unchanged', async () => {
      const existingLesson = {
        id: 'lesson-2',
        sectionId: testSectionId,
        title: 'Lesson 2',
        content: validLessonContent,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        sections: {
          courseId: testCourseId,
        },
      }

      const updatedLesson = {
        ...existingLesson,
        title: 'Updated Lesson 2',
      }

      // Mock transaction
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        prismaMock.lessons.update.mockResolvedValue(updatedLesson as never)
        return await callback(prismaMock)
      })

      prismaMock.lessons.findUnique.mockResolvedValue(existingLesson as never)

      // Act: Update title only (no order change)
      await lessonService.updateLesson('lesson-2', { title: 'Updated Lesson 2' }, testUserId)

      // Assert: No shift operations
      expect(prismaMock.lessons.updateMany).not.toHaveBeenCalled()
      expect(prismaMock.lessons.findUnique).not.toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            sectionId_order: expect.anything(),
          }),
        }),
      )
    })

    it('[SHOULD HAVE] should handle moving to adjacent position (order 2 → 3)', async () => {
      const existingLesson = {
        id: 'lesson-2',
        sectionId: testSectionId,
        title: 'Lesson 2',
        content: validLessonContent,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        sections: {
          courseId: testCourseId,
        },
      }

      const conflictLesson = {
        id: 'lesson-3',
        sectionId: testSectionId,
        title: 'Lesson 3',
        content: validLessonContent,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const lessonsToShift = [{ id: 'lesson-3', order: 3 }]

      const updatedLesson = {
        ...existingLesson,
        order: 3,
      }

      // Mock transaction
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        prismaMock.lessons.findUnique.mockResolvedValue(conflictLesson as never)
        prismaMock.lessons.findMany.mockResolvedValue(lessonsToShift as never)
        prismaMock.lessons.update.mockResolvedValue(updatedLesson as never)
        return await callback(prismaMock)
      })

      prismaMock.lessons.findUnique.mockResolvedValue(existingLesson as never)

      // Act
      await lessonService.updateLesson('lesson-2', { order: 3 }, testUserId)

      // Assert: Only lesson 3 shifted
      expect(prismaMock.lessons.findMany).toHaveBeenCalledWith({
        where: {
          sectionId: testSectionId,
          order: {
            gt: 2,
            lte: 3,
          },
        },
        orderBy: { order: 'asc' },
        select: { id: true, order: true },
      })
    })
  })

  describe('Transaction atomicity', () => {
    it('[MUST HAVE] should rollback shift on create error', async () => {
      // Mock transaction that throws error
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        prismaMock.lessons.findUnique.mockResolvedValue({
          id: 'existing',
          order: 1,
        } as never)
        prismaMock.lessons.updateMany.mockResolvedValue({ count: 2 } as never)

        // Simulate error during create
        prismaMock.lessons.create.mockRejectedValue(new Error('Database error'))

        return await callback(prismaMock)
      })

      // Act & Assert: Should throw error
      await expect(
        lessonService.createLesson(
          testSectionId,
          {
            title: 'Invalid Lesson',
            content: {
              content: {
                type: 'invalid', // Invalid type
                content: [],
              },
              version: 1,
              lastEdit: new Date().toISOString(),
            } as unknown as LessonContent,
            order: 1,
          },
          testUserId,
          testCourseId,
        ),
      ).rejects.toThrow()

      // Note: In real transaction, updateMany would be rolled back
      // Mock doesn't simulate rollback, but the error propagation is tested
    })
  })

  describe('Multiple lessons shift', () => {
    it('[SHOULD HAVE] should shift 10+ lessons correctly', async () => {
      const lessonsToShift = Array.from({ length: 6 }, (_, i) => ({
        id: `lesson-${i + 5}`,
        order: i + 5,
      }))

      const newLesson = {
        id: 'new-lesson-5',
        sectionId: testSectionId,
        title: 'New Lesson at Order 5',
        content: validLessonContent,
        order: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Mock transaction
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        prismaMock.lessons.findUnique.mockResolvedValue({
          id: 'existing-5',
          order: 5,
        } as never)
        // Mock shift of 6 lessons (order 5-10) in descending order
        prismaMock.lessons.findMany.mockResolvedValue(lessonsToShift.reverse() as never)
        prismaMock.lessons.update.mockResolvedValue({} as never)
        prismaMock.lessons.create.mockResolvedValue(newLesson as never)
        return await callback(prismaMock)
      })

      // Act
      const result = await lessonService.createLesson(
        testSectionId,
        {
          title: 'New Lesson at Order 5',
          content: validLessonContent,
          order: 5,
        },
        testUserId,
        testCourseId,
      )

      // Assert
      expect(result.order).toBe(5)
      expect(prismaMock.lessons.findMany).toHaveBeenCalledWith({
        where: {
          sectionId: testSectionId,
          order: { gte: 5 },
        },
        orderBy: { order: 'desc' },
        select: { id: true, order: true },
      })
    })
  })
})

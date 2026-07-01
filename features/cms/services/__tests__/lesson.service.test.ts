/**
 * Lesson Service Integration Tests
 * Requirements: 2.1-2.9, 3.1-3.6
 * Updated: Now tests Course Service integration (Requirements: 0.5, 0.8)
 */

import { lessonService } from '../lesson.service'
import { prismaMock } from '@/prisma/lib/singleton'
import { LessonContent } from '../../types/lesson.types'

// Mock Course Service - must be before other mocks
jest.mock('../course.service')

// Mock the validation module
jest.mock('../../validation/tiptap', () => ({
  validateLessonContent: jest.fn((content: LessonContent) => {
    // Simple validation for testing
    if (!content.content || content.content.type !== 'doc') {
      throw new Error('Invalid Tiptap JSON structure')
    }
    if (!Number.isInteger(content.version) || content.version < 1) {
      throw new Error('Invalid version number')
    }
    if (!content.lastEdit || isNaN(Date.parse(content.lastEdit))) {
      throw new Error('Invalid lastEdit timestamp')
    }
    return content
  }),
}))

import { checkCourseOwnership } from '../course.service'

describe('LessonService', () => {
  const mockUserId = 'test-user-id'
  const mockCourseId = 'course-1'

  beforeEach(() => {
    jest.clearAllMocks()
    // Default: user has ownership
    ;(checkCourseOwnership as jest.Mock).mockResolvedValue(true)
    // Mock $transaction globally to execute callback with prismaMock as tx
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock))
  })

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
    lastEdit: '2026-03-08T10:00:00Z',
  }

  describe('createLesson', () => {
    it('should create a lesson with valid data', async () => {
      const sectionId = 'section-1'
      const input = {
        title: 'Introduction to HTML',
        content: validLessonContent,
        order: 1,
      }

      const mockSection = {
        id: sectionId,
        courseId: mockCourseId,
        order: 1,
        title: 'Section 1',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockLesson = {
        id: 'lesson-1',
        sectionId,
        title: input.title,
        content: input.content,
        order: input.order,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
//eslint-disable-next-line 
      prismaMock.sections.findUnique.mockResolvedValue(mockSection as any)
      prismaMock.lessons.findUnique.mockResolvedValue(null) // No duplicate
      prismaMock.lessons.create.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.createLesson(sectionId, input, mockUserId)

      expect(result).toEqual(mockLesson)
      expect(checkCourseOwnership).toHaveBeenCalledWith(mockCourseId, mockUserId)
      expect(prismaMock.sections.findUnique).toHaveBeenCalledWith({
        where: { id: sectionId },
        select: { id: true, courseId: true },
      })
      expect(prismaMock.lessons.create).toHaveBeenCalled()
    })

    it('should reject unauthorized user', async () => {
      // Requirement: 0.5, 0.8
      const sectionId = 'section-1'
      const input = {
        title: 'Test Lesson',
        content: validLessonContent,
        order: 1,
      }

      const mockSection = {
        id: sectionId,
        courseId: mockCourseId,
      }
//eslint-disable-next-line 
      prismaMock.sections.findUnique.mockResolvedValue(mockSection as any)
      ;(checkCourseOwnership as jest.Mock).mockResolvedValue(false)

      await expect(
        lessonService.createLesson(sectionId, input, mockUserId)
      ).rejects.toThrow('Unauthorized: You do not own this course')
    })

    it('should reject empty title', async () => {
      const input = {
        title: '',
        content: validLessonContent,
        order: 1,
      }

      await expect(
        lessonService.createLesson('section-1', input, mockUserId)
      ).rejects.toThrow('Lesson title is required')
    })

    it('should reject title exceeding 200 characters', async () => {
      const input = {
        title: 'a'.repeat(201),
        content: validLessonContent,
        order: 1,
      }

      await expect(
        lessonService.createLesson('section-1', input, mockUserId)
      ).rejects.toThrow('Lesson title must not exceed 200 characters')
    })

    it('should reject invalid order (zero)', async () => {
      const input = {
        title: 'Test Lesson',
        content: validLessonContent,
        order: 0,
      }

      await expect(
        lessonService.createLesson('section-1', input, mockUserId)
      ).rejects.toThrow('Lesson order must be a positive integer')
    })

    it('should reject invalid order (negative)', async () => {
      const input = {
        title: 'Test Lesson',
        content: validLessonContent,
        order: -1,
      }

      await expect(
        lessonService.createLesson('section-1', input, mockUserId)
      ).rejects.toThrow('Lesson order must be a positive integer')
    })

    it('should reject invalid order (decimal)', async () => {
      const input = {
        title: 'Test Lesson',
        content: validLessonContent,
        order: 1.5,
      }

      await expect(
        lessonService.createLesson('section-1', input, mockUserId)
      ).rejects.toThrow('Lesson order must be a positive integer')
    })

    it('should reject invalid Tiptap JSON structure', async () => {
      const invalidContent = {
        content: {
          type: 'invalid', // Invalid type
          content: [],
        },
        version: 1,
        lastEdit: '2026-03-08T10:00:00Z',
      }

      const input = {
        title: 'Test Lesson',
        content: invalidContent as unknown as LessonContent,
        order: 1,
      }

      await expect(
        lessonService.createLesson('section-1', input, mockUserId)
      ).rejects.toThrow('Invalid lesson content')
    })

    it('should reject when section does not exist', async () => {
      const input = {
        title: 'Test Lesson',
        content: validLessonContent,
        order: 1,
      }

      prismaMock.sections.findUnique.mockResolvedValue(null)

      await expect(
        lessonService.createLesson('nonexistent-section', input, mockUserId)
      ).rejects.toThrow('Section not found')
    })

    it('should handle duplicate order within same section by shifting', async () => {
      const sectionId = 'section-1'
      const input = {
        title: 'Test Lesson',
        content: validLessonContent,
        order: 1,
      }

      const mockSection = {
        id: sectionId,
        courseId: mockCourseId,
        order: 1,
        title: 'Section 1',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const existingLesson = {
        id: 'existing-lesson',
        sectionId,
        title: 'Existing Lesson',
        content: validLessonContent,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockLesson = {
        id: 'new-lesson',
        sectionId,
        title: input.title,
        content: input.content,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.sections.findUnique.mockResolvedValue(mockSection as any)
      prismaMock.lessons.findUnique.mockResolvedValue(existingLesson as unknown as never)
      prismaMock.lessons.findMany.mockResolvedValue([existingLesson] as unknown as never)
      prismaMock.lessons.update.mockResolvedValue({} as never)
      prismaMock.lessons.create.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.createLesson(sectionId, input, mockUserId)
      expect(result).toEqual(mockLesson)
      expect(prismaMock.lessons.update).toHaveBeenCalled()
      expect(prismaMock.lessons.create).toHaveBeenCalled()
    })
  })

  describe('getLessonsBySection', () => {
    it('should return lessons ordered by order field', async () => {
      const sectionId = 'section-1'
      const mockLessons = [
        {
          id: 'lesson-1',
          sectionId,
          title: 'Lesson 1',
          content: validLessonContent,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'lesson-2',
          sectionId,
          title: 'Lesson 2',
          content: validLessonContent,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      prismaMock.lessons.findMany.mockResolvedValue(mockLessons as unknown as never)

      const result = await lessonService.getLessonsBySection(sectionId)

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Lesson 1')
      // Service returns contentPreview (extracted from content JSON)
      expect(result[0]).toHaveProperty('contentPreview')
      expect(prismaMock.lessons.findMany).toHaveBeenCalledWith({
        where: { sectionId },
        orderBy: { order: 'asc' },
        select: expect.any(Object),
      })
    })

    it('should truncate content preview to 200 characters', async () => {
      const longContent: LessonContent = {
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'a'.repeat(250) }],
            },
          ],
        },
        version: 1,
        lastEdit: '2026-03-08T10:00:00Z',
      }

      const mockLessons = [
        {
          id: 'lesson-1',
          sectionId: 'section-1',
          title: 'Lesson 1',
          content: longContent,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      prismaMock.lessons.findMany.mockResolvedValue(mockLessons as unknown as never)

      const result = await lessonService.getLessonsBySection('section-1')

      // contentPreview should be truncated to 200 chars + '...'
      expect(result[0]).toHaveProperty('contentPreview')
      expect(result[0].contentPreview.length).toBeLessThanOrEqual(203) // 200 + '...'
      expect(result[0].title).toBe('Lesson 1')
    })
  })

  describe('getLessonById', () => {
    it('should return lesson with full content and section info', async () => {
      const lessonId = 'lesson-1'
      const mockLesson = {
        id: lessonId,
        sectionId: 'section-1',
        title: 'Test Lesson',
        content: validLessonContent,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        sections: {
          id: 'section-1',
          title: 'Section 1',
          courseId: 'course-1',
        },
      }

      prismaMock.lessons.findUnique.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.getLessonById(lessonId)

      // sections key dihapus dari result, diganti dengan section
      const { sections: _sections, ...lessonWithoutSections } = mockLesson
      expect(result).toEqual({ ...lessonWithoutSections, section: mockLesson.sections })
      expect(result?.section).toBeDefined()
      expect(result).not.toHaveProperty('sections')
      expect(prismaMock.lessons.findUnique).toHaveBeenCalledWith({
        where: { id: lessonId },
        include: {
          sections: {
            select: {
              id: true,
              title: true,
              courseId: true,
            },
          },
        },
      })
    })

    it('should return null for nonexistent lesson', async () => {
      prismaMock.lessons.findUnique.mockResolvedValue(null)

      const result = await lessonService.getLessonById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('updateLesson', () => {
    const existingLesson = {
      id: 'lesson-1',
      sectionId: 'section-1',
      title: 'Original Title',
      content: validLessonContent,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      sections: {
        courseId: mockCourseId,
      },
    }

    it('should update lesson title', async () => {
      const input = { title: 'Updated Title' }

      prismaMock.lessons.findUnique.mockResolvedValue(existingLesson as unknown as never)
      prismaMock.lessons.update.mockResolvedValue({
        ...existingLesson,
        title: input.title,
      } as unknown as never)

      const result = await lessonService.updateLesson('lesson-1', input, mockUserId)

      expect(result.title).toBe('Updated Title')
      expect(checkCourseOwnership).toHaveBeenCalledWith(mockCourseId, mockUserId)
      expect(prismaMock.lessons.update).toHaveBeenCalled()
    })

    it('should reject unauthorized user', async () => {
      // Requirement: 0.5, 0.8
      const input = { title: 'Updated Title' }

      prismaMock.lessons.findUnique.mockResolvedValue(existingLesson as unknown as never)
      ;(checkCourseOwnership as jest.Mock).mockResolvedValue(false)

      await expect(
        lessonService.updateLesson('lesson-1', input, mockUserId)
      ).rejects.toThrow('Unauthorized: You do not own this course')
    })

    it('should increment version when content is updated', async () => {
      const updatedContent: LessonContent = {
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Updated content' }],
            },
          ],
        },
        version: 1, // Will be incremented to 2
        lastEdit: '2026-03-08T11:00:00Z',
      }

      const input = { content: updatedContent }

      prismaMock.lessons.findUnique.mockResolvedValue(existingLesson as unknown as never)
      prismaMock.lessons.update.mockResolvedValue({
        ...existingLesson,
        content: { ...updatedContent, version: 2 },
      } as unknown as never)

      await lessonService.updateLesson('lesson-1', input, mockUserId)

      const updateCall = prismaMock.lessons.update.mock.calls[0][0]
      const updatedContentData = updateCall.data.content as LessonContent
      
      expect(updatedContentData.version).toBe(2)
      expect(updatedContentData.lastEdit).toBeDefined()
    })

    it('should reject empty title', async () => {
      const input = { title: '' }

      prismaMock.lessons.findUnique.mockResolvedValue(existingLesson as unknown as never)

      await expect(
        lessonService.updateLesson('lesson-1', input, mockUserId)
      ).rejects.toThrow('Lesson title cannot be empty')
    })

    it('should reject when lesson does not exist', async () => {
      prismaMock.lessons.findUnique.mockResolvedValue(null)

      await expect(
        lessonService.updateLesson('nonexistent', { title: 'Test' }, mockUserId)
      ).rejects.toThrow('Lesson not found')
    })

    it('should handle duplicate order by shifting', async () => {
      const input = { order: 2 }

      const duplicateLesson = {
        id: 'lesson-2',
        sectionId: 'section-1',
        title: 'Lesson 2',
        content: validLessonContent,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockUpdatedLesson = {
        ...existingLesson,
        order: 2,
      }

      prismaMock.lessons.findUnique
        .mockResolvedValueOnce(existingLesson as unknown as never) // First call: get existing
        .mockResolvedValueOnce(duplicateLesson as unknown as never) // Second call: check duplicate
      
      prismaMock.lessons.findMany.mockResolvedValue([duplicateLesson] as unknown as never)
      prismaMock.lessons.update
        .mockResolvedValueOnce({} as never) // shift update
        .mockResolvedValueOnce(mockUpdatedLesson as unknown as never) // final update

      const result = await lessonService.updateLesson('lesson-1', input, mockUserId)
      expect(result).toEqual(mockUpdatedLesson)
    })
  })

  describe('deleteLesson', () => {
    it('should delete lesson and return progress count', async () => {
      const lessonId = 'lesson-1'
      const mockLesson = {
        id: lessonId,
        sectionId: 'section-1',
        title: 'Test Lesson',
        content: validLessonContent,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          lesson_progress: 5,
        },
        sections: {
          courseId: mockCourseId,
        },
      }

      prismaMock.lessons.findUnique.mockResolvedValue(mockLesson as unknown as never)
      // Mock $transaction to execute the callback with prismaMock as tx
      //eslint-disable-next-line 
      prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock))
      //eslint-disable-next-line 
      prismaMock.lesson_progress.deleteMany.mockResolvedValue({ count: 5 } as any)
      prismaMock.lessons.delete.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.deleteLesson(lessonId, mockUserId)

      expect(result.message).toBe('Lesson deleted successfully')
      // deletedProgressRecords is 0 — cascade handled by DB transaction
      expect(result.deletedProgressRecords).toBe(0)
      expect(checkCourseOwnership).toHaveBeenCalledWith(mockCourseId, mockUserId)
      expect(prismaMock.lesson_progress.deleteMany).toHaveBeenCalledWith({
        where: { lessonId },
      })
      expect(prismaMock.lessons.delete).toHaveBeenCalledWith({
        where: { id: lessonId },
      })
    })

    it('should reject unauthorized user', async () => {
      // Requirement: 0.5, 0.8
      const lessonId = 'lesson-1'
      const mockLesson = {
        id: lessonId,
        sectionId: 'section-1',
        _count: {
          lesson_progress: 5,
        },
        sections: {
          courseId: mockCourseId,
        },
      }

      prismaMock.lessons.findUnique.mockResolvedValue(mockLesson as unknown as never)
      ;(checkCourseOwnership as jest.Mock).mockResolvedValue(false)

      await expect(
        lessonService.deleteLesson(lessonId, mockUserId)
      ).rejects.toThrow('Unauthorized: You do not own this course')
    })

    it('should reject when lesson does not exist', async () => {
      prismaMock.lessons.findUnique.mockResolvedValue(null)

      await expect(lessonService.deleteLesson('nonexistent', mockUserId)).rejects.toThrow(
        'Lesson not found'
      )
    })
  })

  describe('Helper methods', () => {
    it('should verify lesson belongs to section', async () => {
      const mockLesson = {
        id: 'lesson-1',
        sectionId: 'section-1',
      }

      prismaMock.lessons.findUnique.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.verifyLessonBelongsToSection(
        'lesson-1',
        'section-1'
      )

      expect(result).toBe(true)
    })

    it('should return false when lesson does not belong to section', async () => {
      const mockLesson = {
        id: 'lesson-1',
        sectionId: 'section-2',
      }

      prismaMock.lessons.findUnique.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.verifyLessonBelongsToSection(
        'lesson-1',
        'section-1'
      )

      expect(result).toBe(false)
    })

    it('should get course ID for lesson', async () => {
      const mockLesson = {
        id: 'lesson-1',
        sections: {
          courseId: 'course-1',
        },
      }

      prismaMock.lessons.findUnique.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.getCourseIdForLesson('lesson-1')

      expect(result).toBe('course-1')
    })
  })
})

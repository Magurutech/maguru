/**
 * Lesson Service Integration Tests
 * Requirements: 2.1-2.9, 3.1-3.6
 */

import { lessonService } from '../lesson.service'
import { prismaMock } from '@/prisma/lib/singleton'
import { LessonContent } from '../../types/lesson.types'

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

describe('LessonService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
        courseId: 'course-1',
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

      prismaMock.section.findUnique.mockResolvedValue(mockSection)
      prismaMock.lesson.findUnique.mockResolvedValue(null) // No duplicate
      prismaMock.lesson.create.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.createLesson(sectionId, input)

      expect(result).toEqual(mockLesson)
      expect(prismaMock.section.findUnique).toHaveBeenCalledWith({
        where: { id: sectionId },
      })
      expect(prismaMock.lesson.create).toHaveBeenCalled()
    })

    it('should reject empty title', async () => {
      const input = {
        title: '',
        content: validLessonContent,
        order: 1,
      }

      await expect(
        lessonService.createLesson('section-1', input)
      ).rejects.toThrow('Lesson title is required')
    })

    it('should reject title exceeding 200 characters', async () => {
      const input = {
        title: 'a'.repeat(201),
        content: validLessonContent,
        order: 1,
      }

      await expect(
        lessonService.createLesson('section-1', input)
      ).rejects.toThrow('Lesson title must not exceed 200 characters')
    })

    it('should reject invalid order (zero)', async () => {
      const input = {
        title: 'Test Lesson',
        content: validLessonContent,
        order: 0,
      }

      await expect(
        lessonService.createLesson('section-1', input)
      ).rejects.toThrow('Lesson order must be a positive integer')
    })

    it('should reject invalid order (negative)', async () => {
      const input = {
        title: 'Test Lesson',
        content: validLessonContent,
        order: -1,
      }

      await expect(
        lessonService.createLesson('section-1', input)
      ).rejects.toThrow('Lesson order must be a positive integer')
    })

    it('should reject invalid order (decimal)', async () => {
      const input = {
        title: 'Test Lesson',
        content: validLessonContent,
        order: 1.5,
      }

      await expect(
        lessonService.createLesson('section-1', input)
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
        lessonService.createLesson('section-1', input)
      ).rejects.toThrow('Invalid lesson content')
    })

    it('should reject when section does not exist', async () => {
      const input = {
        title: 'Test Lesson',
        content: validLessonContent,
        order: 1,
      }

      prismaMock.section.findUnique.mockResolvedValue(null)

      await expect(
        lessonService.createLesson('nonexistent-section', input)
      ).rejects.toThrow('Section not found')
    })

    it('should reject duplicate order within same section', async () => {
      const sectionId = 'section-1'
      const input = {
        title: 'Test Lesson',
        content: validLessonContent,
        order: 1,
      }

      const mockSection = {
        id: sectionId,
        courseId: 'course-1',
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

      prismaMock.section.findUnique.mockResolvedValue(mockSection)
      prismaMock.lesson.findUnique.mockResolvedValue(existingLesson as unknown as never)

      await expect(
        lessonService.createLesson(sectionId, input)
      ).rejects.toThrow('Lesson with order 1 already exists in this section')
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

      prismaMock.lesson.findMany.mockResolvedValue(mockLessons as unknown as never)

      const result = await lessonService.getLessonsBySection(sectionId)

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Lesson 1')
      expect(result[0].contentPreview).toBe('Test content')
      expect(prismaMock.lesson.findMany).toHaveBeenCalledWith({
        where: { sectionId },
        orderBy: { order: 'asc' },
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

      prismaMock.lesson.findMany.mockResolvedValue(mockLessons as unknown as never)

      const result = await lessonService.getLessonsBySection('section-1')

      expect(result[0].contentPreview.length).toBeLessThanOrEqual(203) // 200 + '...'
      expect(result[0].contentPreview).toContain('...')
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
        section: {
          id: 'section-1',
          title: 'Section 1',
          courseId: 'course-1',
        },
      }

      prismaMock.lesson.findUnique.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.getLessonById(lessonId)

      expect(result).toEqual(mockLesson)
      expect(result?.section).toBeDefined()
      expect(prismaMock.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: lessonId },
        include: {
          section: {
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
      prismaMock.lesson.findUnique.mockResolvedValue(null)

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
    }

    it('should update lesson title', async () => {
      const input = { title: 'Updated Title' }

      prismaMock.lesson.findUnique.mockResolvedValue(existingLesson as unknown as never)
      prismaMock.lesson.update.mockResolvedValue({
        ...existingLesson,
        title: input.title,
      } as unknown as never)

      const result = await lessonService.updateLesson('lesson-1', input)

      expect(result.title).toBe('Updated Title')
      expect(prismaMock.lesson.update).toHaveBeenCalled()
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

      prismaMock.lesson.findUnique.mockResolvedValue(existingLesson as unknown as never)
      prismaMock.lesson.update.mockResolvedValue({
        ...existingLesson,
        content: { ...updatedContent, version: 2 },
      } as unknown as never)

      await lessonService.updateLesson('lesson-1', input)

      const updateCall = prismaMock.lesson.update.mock.calls[0][0]
      const updatedContentData = updateCall.data.content as LessonContent
      
      expect(updatedContentData.version).toBe(2)
      expect(updatedContentData.lastEdit).toBeDefined()
    })

    it('should reject empty title', async () => {
      const input = { title: '' }

      prismaMock.lesson.findUnique.mockResolvedValue(existingLesson as unknown as never)

      await expect(
        lessonService.updateLesson('lesson-1', input)
      ).rejects.toThrow('Lesson title cannot be empty')
    })

    it('should reject when lesson does not exist', async () => {
      prismaMock.lesson.findUnique.mockResolvedValue(null)

      await expect(
        lessonService.updateLesson('nonexistent', { title: 'Test' })
      ).rejects.toThrow('Lesson not found')
    })

    it('should reject duplicate order', async () => {
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

      prismaMock.lesson.findUnique
        .mockResolvedValueOnce(existingLesson as unknown as never) // First call: get existing
        .mockResolvedValueOnce(duplicateLesson as unknown as never) // Second call: check duplicate

      await expect(
        lessonService.updateLesson('lesson-1', input)
      ).rejects.toThrow('Lesson with order 2 already exists in this section')
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
          progress: 5,
        },
      }

      prismaMock.lesson.findUnique.mockResolvedValue(mockLesson as unknown as never)
      prismaMock.lesson.delete.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.deleteLesson(lessonId)

      expect(result.message).toBe('Lesson deleted successfully')
      expect(result.deletedProgressRecords).toBe(5)
      expect(prismaMock.lesson.delete).toHaveBeenCalledWith({
        where: { id: lessonId },
      })
    })

    it('should reject when lesson does not exist', async () => {
      prismaMock.lesson.findUnique.mockResolvedValue(null)

      await expect(lessonService.deleteLesson('nonexistent')).rejects.toThrow(
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

      prismaMock.lesson.findUnique.mockResolvedValue(mockLesson as unknown as never)

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

      prismaMock.lesson.findUnique.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.verifyLessonBelongsToSection(
        'lesson-1',
        'section-1'
      )

      expect(result).toBe(false)
    })

    it('should get course ID for lesson', async () => {
      const mockLesson = {
        id: 'lesson-1',
        section: {
          courseId: 'course-1',
        },
      }

      prismaMock.lesson.findUnique.mockResolvedValue(mockLesson as unknown as never)

      const result = await lessonService.getCourseIdForLesson('lesson-1')

      expect(result).toBe('course-1')
    })
  })
})

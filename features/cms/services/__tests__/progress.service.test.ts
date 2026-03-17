/**
 * Progress Service Integration Tests
 * Requirements: 6.1-6.8, 7.1-7.7, 12.2
 */

import { progressService } from '../progress.service'
import { prismaMock } from '@/prisma/lib/singleton'

// Mock the calculation module
jest.mock('@/lib/progress/calculation', () => ({
  calculateCourseCompletion: jest.fn((data: { totalLessons: number; completedLessons: number }) => {
    const { totalLessons, completedLessons } = data
    
    if (totalLessons === 0) {
      return { percentage: 0, completed: false }
    }
    
    const percentage = (completedLessons / totalLessons) * 100
    const roundedPercentage = Math.round(percentage * 100) / 100
    const completed = roundedPercentage === 100
    
    return {
      percentage: roundedPercentage,
      completed,
    }
  }),
}))

describe('ProgressService', () => {
  const mockUserId = 'test-user-id'
  const mockLessonId = 'lesson-1'
  const mockCourseId = 'course-1'
  const mockCourseSlug = 'test-course'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('markLessonComplete', () => {
    it('should mark lesson as complete and update course completion', async () => {
      // Requirement: 6.2, 6.3, 6.7, 12.2
      const mockLesson = {
        id: mockLessonId,
        sectionId: 'section-1',
        title: 'Test Lesson',
        content: {},
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        sections: {
          courseId: mockCourseId,
        },
      }

      const mockLessonProgress = {
        id: 'progress-1',
        lessonId: mockLessonId,
        userId: mockUserId,
        completed: true,
        completedAt: new Date('2026-03-11T10:00:00Z'),
        createdAt: new Date('2026-03-11T10:00:00Z'),
        updatedAt: new Date('2026-03-11T10:00:00Z'),
      }

      const mockCourseCompletion = {
        id: 'completion-1',
        courseId: mockCourseId,
        userId: mockUserId,
        percentage: 50,
        completed: false,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.lessons.findUnique.mockResolvedValue(mockLesson as never)
      prismaMock.lesson_progress.upsert.mockResolvedValue(mockLessonProgress as never)
      prismaMock.lessons.count.mockResolvedValue(10)
      prismaMock.lesson_progress.count.mockResolvedValue(5)
      prismaMock.course_completions.upsert.mockResolvedValue(mockCourseCompletion as never)

      const result = await progressService.markLessonComplete(mockLessonId, mockUserId)

      expect(result).toEqual({
        id: mockLessonProgress.id,
        lessonId: mockLessonProgress.lessonId,
        userId: mockLessonProgress.userId,
        completed: mockLessonProgress.completed,
        completedAt: mockLessonProgress.completedAt.toISOString(),
        createdAt: mockLessonProgress.createdAt.toISOString(),
      })

      expect(prismaMock.lessons.findUnique).toHaveBeenCalledWith({
        where: { id: mockLessonId },
        include: {
          sections: {
            select: {
              courseId: true,
            },
          },
        },
      })

      expect(prismaMock.lesson_progress.upsert).toHaveBeenCalledWith({
        where: {
          lessonId_userId: {
            lessonId: mockLessonId,
            userId: mockUserId,
          },
        },
        update: {
          completed: true,
          completedAt: expect.any(Date),
        },
        create: {
          id: expect.any(String),
          lessonId: mockLessonId,
          userId: mockUserId,
          completed: true,
          completedAt: expect.any(Date),
        },
      })

      // Verify course completion was updated
      expect(prismaMock.course_completions.upsert).toHaveBeenCalled()
    })

    it('should throw error when lesson does not exist', async () => {
      prismaMock.lessons.findUnique.mockResolvedValue(null)

      await expect(
        progressService.markLessonComplete(mockLessonId, mockUserId)
      ).rejects.toThrow('Lesson not found')
    })

    it('should handle creating new progress record', async () => {
      const mockLesson = {
        id: mockLessonId,
        sections: {
          courseId: mockCourseId,
        },
      }

      const mockLessonProgress = {
        id: 'progress-1',
        lessonId: mockLessonId,
        userId: mockUserId,
        completed: true,
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.lessons.findUnique.mockResolvedValue(mockLesson as never)
      prismaMock.lesson_progress.upsert.mockResolvedValue(mockLessonProgress as never)
      prismaMock.lessons.count.mockResolvedValue(5)
      prismaMock.lesson_progress.count.mockResolvedValue(1)
      prismaMock.course_completions.upsert.mockResolvedValue({} as never)

      const result = await progressService.markLessonComplete(mockLessonId, mockUserId)

      expect(result.completed).toBe(true)
      expect(result.completedAt).toBeDefined()
    })
  })

  describe('getLessonProgress', () => {
    it('should return lesson progress when record exists', async () => {
      // Requirement: 6.5, 6.6
      const mockLessonProgress = {
        id: 'progress-1',
        lessonId: mockLessonId,
        userId: mockUserId,
        completed: true,
        completedAt: new Date('2026-03-11T10:00:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.lesson_progress.findUnique.mockResolvedValue(mockLessonProgress as never)

      const result = await progressService.getLessonProgress(mockLessonId, mockUserId)

      expect(result).toEqual({
        lessonId: mockLessonId,
        userId: mockUserId,
        completed: true,
        completedAt: '2026-03-11T10:00:00.000Z',
      })

      expect(prismaMock.lesson_progress.findUnique).toHaveBeenCalledWith({
        where: {
          lessonId_userId: {
            lessonId: mockLessonId,
            userId: mockUserId,
          },
        },
      })
    })

    it('should return default not completed status when no record exists', async () => {
      prismaMock.lesson_progress.findUnique.mockResolvedValue(null)

      const result = await progressService.getLessonProgress(mockLessonId, mockUserId)

      expect(result).toEqual({
        lessonId: mockLessonId,
        userId: mockUserId,
        completed: false,
        completedAt: null,
      })
    })

    it('should handle null completedAt', async () => {
      const mockLessonProgress = {
        id: 'progress-1',
        lessonId: mockLessonId,
        userId: mockUserId,
        completed: false,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.lesson_progress.findUnique.mockResolvedValue(mockLessonProgress as never)

      const result = await progressService.getLessonProgress(mockLessonId, mockUserId)

      expect(result.completedAt).toBeNull()
    })
  })

  describe('getCourseProgress', () => {
    it('should return course progress with correct percentage', async () => {
      // Requirement: 7.1, 7.2, 7.5, 7.6, 7.7
      const mockCourse = {
        id: mockCourseId,
        title: mockCourseSlug,
        description: 'Test Course',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockCourseCompletion = {
        id: 'completion-1',
        courseId: mockCourseId,
        userId: mockUserId,
        percentage: 50,
        completed: false,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.courses.findFirst.mockResolvedValue(mockCourse as never)
      prismaMock.lessons.count.mockResolvedValue(10) // Total lessons
      prismaMock.lesson_progress.count.mockResolvedValue(5) // Completed lessons
      prismaMock.course_completions.findUnique.mockResolvedValue(mockCourseCompletion as never)

      const result = await progressService.getCourseProgress(mockCourseSlug, mockUserId)

      expect(result).toEqual({
        courseId: mockCourseId,
        userId: mockUserId,
        percentage: 50,
        completedLessons: 5,
        totalLessons: 10,
        completed: false,
        completedAt: null,
      })

      expect(prismaMock.courses.findFirst).toHaveBeenCalledWith({
        where: {
          title: mockCourseSlug,
        },
      })
    })

    it('should throw error when course does not exist', async () => {
      prismaMock.courses.findFirst.mockResolvedValue(null)

      await expect(
        progressService.getCourseProgress(mockCourseSlug, mockUserId)
      ).rejects.toThrow('Course not found')
    })

    it('should create course completion record if not exists', async () => {
      const mockCourse = {
        id: mockCourseId,
        title: mockCourseSlug,
      }

      const newCourseCompletion = {
        id: 'completion-1',
        courseId: mockCourseId,
        userId: mockUserId,
        percentage: 0,
        completed: false,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.courses.findFirst.mockResolvedValue(mockCourse as never)
      prismaMock.lessons.count.mockResolvedValue(10)
      prismaMock.lesson_progress.count.mockResolvedValue(0)
      prismaMock.course_completions.findUnique.mockResolvedValue(null)
      prismaMock.course_completions.create.mockResolvedValue(newCourseCompletion as never)

      const result = await progressService.getCourseProgress(mockCourseSlug, mockUserId)

      expect(result.percentage).toBe(0)
      expect(result.completed).toBe(false)
      expect(prismaMock.course_completions.create).toHaveBeenCalledWith({
        data: {
          id: expect.any(String),
          courseId: mockCourseId,
          userId: mockUserId,
          percentage: 0,
          completed: false,
          completedAt: null,
          updatedAt: expect.any(Date),
        },
      })
    })

    it('should handle 100% completion', async () => {
      const mockCourse = {
        id: mockCourseId,
        title: mockCourseSlug,
      }

      const completedCourseCompletion = {
        id: 'completion-1',
        courseId: mockCourseId,
        userId: mockUserId,
        percentage: 100,
        completed: true,
        completedAt: new Date('2026-03-11T10:00:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.courses.findFirst.mockResolvedValue(mockCourse as never)
      prismaMock.lessons.count.mockResolvedValue(10)
      prismaMock.lesson_progress.count.mockResolvedValue(10)
      prismaMock.course_completions.findUnique.mockResolvedValue(completedCourseCompletion as never)

      const result = await progressService.getCourseProgress(mockCourseSlug, mockUserId)

      expect(result.percentage).toBe(100)
      expect(result.completed).toBe(true)
      expect(result.completedAt).toBe('2026-03-11T10:00:00.000Z')
    })

    it('should handle course with zero lessons', async () => {
      // Requirement: 7.7
      const mockCourse = {
        id: mockCourseId,
        title: mockCourseSlug,
      }

      const mockCourseCompletion = {
        id: 'completion-1',
        courseId: mockCourseId,
        userId: mockUserId,
        percentage: 0,
        completed: false,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.courses.findFirst.mockResolvedValue(mockCourse as never)
      prismaMock.lessons.count.mockResolvedValue(0)
      prismaMock.lesson_progress.count.mockResolvedValue(0)
      prismaMock.course_completions.findUnique.mockResolvedValue(mockCourseCompletion as never)

      const result = await progressService.getCourseProgress(mockCourseSlug, mockUserId)

      expect(result.percentage).toBe(0)
      expect(result.completed).toBe(false)
      expect(result.totalLessons).toBe(0)
    })
  })
})

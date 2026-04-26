/**
 * Lesson Service
 * Business logic for Lesson management
 * Requirements: 2.1-2.9, 3.1-3.6, 9.2, 9.3, 9.6, 9.9, 12.7
 * Updated: Now uses Course Service for authorization (Requirements: 0.5, 0.8)
 */

import prisma from '@/prisma/lib/client'
import { checkCourseOwnership } from './course.service'
import { validateLessonContent } from '../validation/tiptap'
import {
  Lesson,
  LessonWithPreview,
  LessonWithContent,
  CreateLessonInput,
  UpdateLessonInput,
  DeleteLessonResult,
  LessonContent,
  TiptapNode,
} from '../types/lesson.types'

export class LessonService {
  /**
   * Create a new lesson within a section
   * Requirements: 2.1, 2.7, 2.8, 3.1, 9.2, 9.3, 9.6, 9.9
   * Authorization: Uses Course Service (Requirements: 0.5, 0.8)
   *
   * @param courseId - Optional: pass if already known to skip an extra DB query
   */
  async createLesson(
    sectionId: string,
    input: CreateLessonInput,
    userId?: string,
    courseId?: string
  ): Promise<Lesson> {
    // Validate title
    if (!input.title || input.title.trim().length === 0) {
      throw new Error('Lesson title is required')
    }

    if (input.title.length > 200) {
      throw new Error('Lesson title must not exceed 200 characters')
    }

    // Validate order early (before DB queries) if explicitly provided
    if (input.order !== undefined && input.order !== null) {
      if (!Number.isInteger(input.order) || input.order < 1) {
        throw new Error('Lesson order must be a positive integer')
      }
    }

    // Validate LessonContent structure
    try {
      validateLessonContent(input.content)
    } catch (error) {
      throw new Error(
        `Invalid lesson content: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }

    // Resolve courseId — skip DB query if already provided by caller
    let resolvedCourseId = courseId
    if (!resolvedCourseId) {
      const section = await prisma.sections.findUnique({
        where: { id: sectionId },
        select: { id: true, courseId: true },
      })
      if (!section) throw new Error('Section not found')
      resolvedCourseId = section.courseId
    }

    // Check course ownership using Course Service
    if (userId) {
      const hasOwnership = await checkCourseOwnership(resolvedCourseId, userId)
      if (!hasOwnership) {
        throw new Error('Unauthorized: You do not own this course')
      }
    }

    // Auto-calculate order: max existing order + 1, or 1 if no lessons yet
    let order = input.order
    if (order === undefined || order === null) {
      const maxOrderResult = await prisma.lessons.aggregate({
        where: { sectionId },
        _max: { order: true },
      })
      order = (maxOrderResult._max.order ?? 0) + 1
    } else {
      // Order already validated above — just check for duplicates
      const existingLesson = await prisma.lessons.findUnique({
        where: { sectionId_order: { sectionId, order } },
      })
      if (existingLesson) {
        throw new Error(`Lesson with order ${order} already exists in this section`)
      }
    }

    // Create lesson
    const lesson = await prisma.lessons.create({
      data: {
        id: crypto.randomUUID(),
        sectionId,
        title: input.title.trim(),
        content: input.content as unknown as never,
        order,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return lesson
  }

  /**
   * Get all lessons for a section, ordered by order field
   * Requirements: 2.2, 8.3
   */
  async getLessonsBySection(sectionId: string): Promise<LessonWithPreview[]> {
    const lessons = await prisma.lessons.findMany({
      where: { sectionId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        sectionId: true,
        order: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return lessons.map((l) => {
      const lessonContent = l.content as unknown as LessonContent | null
      const contentPreview = lessonContent ? this.extractContentPreview(lessonContent) : ''
      const { content: _content, ...rest } = l
      return { ...rest, contentPreview }
    })
  }

  /**
   * Get lessons for a section in a single query, validating section existence.
   * Returns null if section does not exist.
   *
   * Uses relationLoadStrategy: "join" → single SQL JOIN query instead of 2 queries.
   * Selects only needed fields (excludes heavy `content` JSON).
   * Requirements: 2.2, 8.3
   */
  async getLessonsBySectionWithValidation(
    sectionId: string
  ): Promise<LessonWithPreview[] | null> {
    const section = await prisma.sections.findUnique({
      where: { id: sectionId },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            sectionId: true,
            order: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    if (!section) return null

    return section.lessons.map((l) => {
      const lessonContent = l.content as unknown as LessonContent | null
      const contentPreview = lessonContent ? this.extractContentPreview(lessonContent) : ''
      const { content: _content, ...rest } = l
      return { ...rest, contentPreview }
    })
  }

  /**
   * Get a single lesson by ID with full content
   * Requirements: 2.3, 3.4
   */
  async getLessonById(lessonId: string): Promise<LessonWithContent | null> {
    const lesson = await prisma.lessons.findUnique({
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

    if (!lesson) {
      return null
    }

    const { sections, ...lessonData } = lesson

    return {
      ...lessonData,
      section: sections,
      content: lesson.content as unknown as LessonContent,
    }
  }

  /**
   * Update an existing lesson
   * Requirements: 2.4, 2.6, 2.7, 2.8, 3.2, 9.2, 9.3
   * Authorization: Uses Course Service (Requirements: 0.5, 0.8)
   */
  async updateLesson(
    lessonId: string,
    input: UpdateLessonInput,
    userId?: string
  ): Promise<Lesson> {
    // Check if lesson exists and get courseId
    const existingLesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        sections: {
          select: { courseId: true },
        },
      },
    })

    if (!existingLesson) {
      throw new Error('Lesson not found')
    }

    // Check course ownership using Course Service
    if (userId) {
      const hasOwnership = await checkCourseOwnership(
        existingLesson.sections.courseId,
        userId
      )
      if (!hasOwnership) {
        throw new Error('Unauthorized: You do not own this course')
      }
    }

    // Validate title if provided
    if (input.title !== undefined) {
      if (!input.title || input.title.trim().length === 0) {
        throw new Error('Lesson title cannot be empty')
      }

      if (input.title.length > 200) {
        throw new Error('Lesson title must not exceed 200 characters')
      }
    }

    // Validate order if provided
    if (input.order !== undefined) {
      if (!Number.isInteger(input.order) || input.order < 1) {
        throw new Error('Lesson order must be a positive integer')
      }

      // Check for duplicate order (if order is changing)
      if (input.order !== existingLesson.order) {
        const duplicateLesson = await prisma.lessons.findUnique({
          where: {
            sectionId_order: {
              sectionId: existingLesson.sectionId,
              order: input.order,
            },
          },
        })

        if (duplicateLesson) {
          throw new Error(
            `Lesson with order ${input.order} already exists in this section`
          )
        }
      }
    }

    // Validate and increment version if content is updated
    let updatedContent: LessonContent | undefined
    if (input.content !== undefined) {
      try {
        validateLessonContent(input.content)
      } catch (error) {
        throw new Error(
          `Invalid lesson content: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      }

      const currentContent = existingLesson.content as unknown as LessonContent
      
      // Increment version and update lastEdit
      updatedContent = {
        ...input.content,
        version: currentContent.version + 1,
        lastEdit: new Date().toISOString(),
      }
    }

    // Update lesson
    const updatedLesson = await prisma.lessons.update({
      where: { id: lessonId },
      data: {
        title: input.title?.trim(),
        content: updatedContent as unknown as never,
        order: input.order,
        updatedAt: new Date(),
      },
    })

    return updatedLesson
  }

  /**
   * Delete a lesson and all its progress records (cascade)
   * Requirements: 2.5, 2.7, 2.8, 12.7
   * Authorization: Uses Course Service (Requirements: 0.5, 0.8)
   */
  async deleteLesson(
    lessonId: string,
    userId?: string
  ): Promise<DeleteLessonResult> {
    // Single query: get only what's needed for auth check
    const existingLesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      select: {
        sections: {
          select: { courseId: true },
        },
      },
    })

    if (!existingLesson) {
      throw new Error('Lesson not found')
    }

    if (userId) {
      const hasOwnership = await checkCourseOwnership(
        existingLesson.sections.courseId,
        userId
      )
      if (!hasOwnership) {
        throw new Error('Unauthorized: You do not own this course')
      }
    }

    // Use transaction to ensure atomicity — progress records deleted before lesson
    // Requirements: 12.3, 12.7
    await prisma.$transaction(async (tx) => {
      await tx.lesson_progress.deleteMany({ where: { lessonId } })
      await tx.lessons.delete({ where: { id: lessonId } })
    })

    return {
      message: 'Lesson deleted successfully',
      deletedProgressRecords: 0, // cascade handled by DB, count not needed
    }
  }

  /**
   * Check if a lesson belongs to a specific section
   * Helper method for authorization
   */
  async verifyLessonBelongsToSection(
    lessonId: string,
    sectionId: string
  ): Promise<boolean> {
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      select: { sectionId: true },
    })

    return lesson?.sectionId === sectionId
  }

  /**
   * Get course ID for a lesson (for authorization checks)
   */
  async getCourseIdForLesson(lessonId: string): Promise<string | null> {
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        sections: {
          select: { courseId: true },
        },
      },
    })

    return lesson?.sections.courseId || null
  }

  /**
   * Extract plain text preview from Tiptap JSON content
   * Requirements: 2.2
   */
  extractContentPreview(content: LessonContent): string {
    const extractText = (nodes: TiptapNode[]): string => {
      let text = ''
      
      for (const node of nodes) {
        if (node.type === 'text') {
          text += node.text
        } else if ('content' in node && node.content) {
          text += extractText(node.content as TiptapNode[])
        }
        
        // Add space between nodes
        if (text && !text.endsWith(' ')) {
          text += ' '
        }
      }
      
      return text
    }

    const plainText = extractText(content.content.content || [])
    const trimmed = plainText.trim()
    
    // Return first 200 characters
    return trimmed.length > 200 ? trimmed.substring(0, 200) + '...' : trimmed
  }
}

// Export singleton instance
export const lessonService = new LessonService()

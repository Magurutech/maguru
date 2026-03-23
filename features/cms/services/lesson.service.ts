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
   */
  async createLesson(
    sectionId: string,
    input: CreateLessonInput,
    userId?: string
  ): Promise<Lesson> {
    // Validate title
    if (!input.title || input.title.trim().length === 0) {
      throw new Error('Lesson title is required')
    }

    if (input.title.length > 200) {
      throw new Error('Lesson title must not exceed 200 characters')
    }

    // Validate order
    if (!Number.isInteger(input.order) || input.order < 1) {
      throw new Error('Lesson order must be a positive integer')
    }

    // Validate LessonContent structure
    try {
      validateLessonContent(input.content)
    } catch (error) {
      throw new Error(
        `Invalid lesson content: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }

    // Check if section exists and get courseId
    const section = await prisma.sections.findUnique({
      where: { id: sectionId },
      select: { id: true, courseId: true },
    })

    if (!section) {
      throw new Error('Section not found')
    }

    // Check course ownership using Course Service
    if (userId) {
      const hasOwnership = await checkCourseOwnership(section.courseId, userId)
      if (!hasOwnership) {
        throw new Error('Unauthorized: You do not own this course')
      }
    }

    // Check for duplicate order
    const existingLesson = await prisma.lessons.findUnique({
      where: {
        sectionId_order: {
          sectionId,
          order: input.order,
        },
      },
    })

    if (existingLesson) {
      throw new Error(
        `Lesson with order ${input.order} already exists in this section`
      )
    }

    // Create lesson
    const lesson = await prisma.lessons.create({
      data: {
        id: crypto.randomUUID(),
        sectionId,
        title: input.title.trim(),
        content: input.content as unknown as never, // Prisma Json type
        order: input.order,
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
    })

    return lessons.map((lesson) => ({
      id: lesson.id,
      sectionId: lesson.sectionId,
      order: lesson.order,
      title: lesson.title,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    }))
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
    // Check if lesson exists and get courseId
    const existingLesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        _count: {
          select: { lesson_progress: true },
        },
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

    const progressCount = existingLesson._count.lesson_progress

    // Delete lesson (cascade will delete progress records)
    await prisma.lessons.delete({
      where: { id: lessonId },
    })

    return {
      message: 'Lesson deleted successfully',
      deletedProgressRecords: progressCount,
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
   * @private
   */
  private extractContentPreview(content: LessonContent): string {
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

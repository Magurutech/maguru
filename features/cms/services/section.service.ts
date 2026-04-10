/**
 * Section Service
 * Business logic for Section management
 * Requirements: 1.1-1.8, 9.1, 9.5, 9.8, 12.5, 12.6
 * Updated: Now uses Course Service for validation and authorization (Requirements: 0.5, 0.8)
 */

import prisma from '@/prisma/lib/client'
import { checkCourseOwnership } from './course.service'
import {
  Section,
  SectionWithLessonCount,
  SectionWithLessons,
  CreateSectionInput,
  UpdateSectionInput,
  DeleteSectionResult,
} from '../types/section.types'

export class SectionService {
  /**
   * Create a new section within a course
   * Requirements: 1.1, 9.1, 9.5, 9.8
   * Authorization: Uses Course Service (Requirements: 0.5, 0.8)
   */
  async createSection(
    courseId: string,
    input: CreateSectionInput,
    userId?: string
  ): Promise<Section> {
    // Validate title
    if (!input.title || input.title.trim().length === 0) {
      throw new Error('Section title is required')
    }

    if (input.title.length > 200) {
      throw new Error('Section title must not exceed 200 characters')
    }

    // Check course ownership using Course Service
    if (userId) {
      const hasOwnership = await checkCourseOwnership(courseId, userId)
      if (!hasOwnership) {
        throw new Error('Unauthorized: You do not own this course')
      }
    }

    // Verify course exists
    const course = await prisma.courses.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      throw new Error('Course not found')
    }

    // Auto-calculate order: max existing order + 1, or 1 if no sections yet
    let order = input.order
    if (order === undefined || order === null) {
      const maxOrderResult = await prisma.sections.aggregate({
        where: { courseId },
        _max: { order: true },
      })
      order = (maxOrderResult._max.order ?? 0) + 1
    } else {
      // If order explicitly provided, validate and check for duplicates
      if (!Number.isInteger(order) || order < 1) {
        throw new Error('Section order must be a positive integer')
      }
      const existingSection = await prisma.sections.findUnique({
        where: { courseId_order: { courseId, order } },
      })
      if (existingSection) {
        throw new Error(`Section with order ${order} already exists in this course`)
      }
    }

    // Create section
    const section = await prisma.sections.create({
      data: {
        id: crypto.randomUUID(),
        courseId,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        order,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return section
  }

  /**
   * Get all sections for a course, ordered by order field
   * Requirements: 1.2
   */
  async getSectionsByCourse(
    courseId: string
  ): Promise<SectionWithLessonCount[]> {
    const sections = await prisma.sections.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    })

    return sections.map((section) => ({
      id: section.id,
      courseId: section.courseId,
      order: section.order,
      title: section.title,
      description: section.description,
      createdAt: section.createdAt,
      updatedAt: section.updatedAt,
      lessonCount: section._count.lessons,
    }))
  }

  /**
   * Get courseId by slug — used by POST handler to avoid direct Prisma in route.
   * Returns null if course does not exist.
   */
  async getCourseIdBySlug(slug: string): Promise<string | null> {
    const course = await prisma.courses.findUnique({
      where: { slug },
      select: { id: true },
    })
    return course?.id ?? null
  }

  /**
   * Get sections by course slug in a single JOIN query.
   * Returns null if course does not exist.
   * Also returns course status for authorization checks in the API layer.
   *
   * Optimized: single SQL JOIN — course lookup + sections + lesson count
   * in one round-trip using relationLoadStrategy: "join".
   * Requirements: 1.2, 8.3
   */
  async getSectionsByCourseSlug(slug: string): Promise<{
    courseId: string
    courseStatus: string
    sections: SectionWithLessons[]
  } | null> {
    const course = await prisma.courses.findUnique({
      where: { slug },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        status: true,
        sections: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            courseId: true,
            title: true,
            description: true,
            order: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: { lessons: true },
            },
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                order: true,
              },
            },
          },
        },
      },
    })

    if (!course) return null

    return {
      courseId: course.id,
      courseStatus: course.status,
      sections: course.sections.map((s) => ({
        id: s.id,
        courseId: s.courseId,
        title: s.title,
        description: s.description,
        order: s.order,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        lessonCount: s._count.lessons,
        lessons: s.lessons,
      })),
    }
  }

  /**
   * Get sections with full lesson details (including contentPreview) by course slug.
   * Used by student learn page to fetch all sections + lessons in one request.
   * Returns null if course does not exist.
   * 
   * Optimized: single SQL JOIN with nested relations
   * Requirements: 1.2, 8.3, Student Learn Page optimization
   */
  async getSectionsWithLessons(slug: string): Promise<{
    courseId: string
    courseStatus: string
    sections: Array<{
      id: string
      courseId: string
      title: string
      description: string | null
      order: number
      createdAt: Date
      updatedAt: Date
      lessonCount: number
      lessons: Array<{
        id: string
        title: string
        order: number
        contentPreview: string
      }>
    }>
  } | null> {
    const course = await prisma.courses.findUnique({
      where: { slug },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        status: true,
        sections: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            courseId: true,
            title: true,
            description: true,
            order: true,
            createdAt: true,
            updatedAt: true,
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                order: true,
                content: true, // Need content to extract preview
              },
            },
          },
        },
      },
    })

    if (!course) return null

    // Import lessonService to extract content preview
    const { lessonService } = await import('./lesson.service')

    return {
      courseId: course.id,
      courseStatus: course.status,
      sections: course.sections.map((s) => ({
        id: s.id,
        courseId: s.courseId,
        title: s.title,
        description: s.description,
        order: s.order,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        lessonCount: s.lessons.length,
        lessons: s.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          order: l.order,
          contentPreview: lessonService.extractContentPreview(
            l.content as unknown as import('../types/lesson.types').LessonContent
          ),
        })),
      })),
    }
  }

  /**
   * Get a single section by ID
   * Requirements: 1.2
   */
  async getSectionById(sectionId: string): Promise<Section | null> {
    const section = await prisma.sections.findUnique({
      where: { id: sectionId },
    })

    return section
  }

  /**
   * Update an existing section
   * Requirements: 1.3, 1.5, 9.1
   * Authorization: Uses Course Service (Requirements: 0.5, 0.8)
   */
  async updateSection(
    sectionId: string,
    input: UpdateSectionInput,
    userId?: string
  ): Promise<Section> {
    // Check if section exists
    const existingSection = await prisma.sections.findUnique({
      where: { id: sectionId },
    })

    if (!existingSection) {
      throw new Error('Section not found')
    }

    // Check course ownership using Course Service
    if (userId) {
      const hasOwnership = await checkCourseOwnership(
        existingSection.courseId,
        userId
      )
      if (!hasOwnership) {
        throw new Error('Unauthorized: You do not own this course')
      }
    }

    // Validate title if provided
    if (input.title !== undefined) {
      if (!input.title || input.title.trim().length === 0) {
        throw new Error('Section title cannot be empty')
      }

      if (input.title.length > 200) {
        throw new Error('Section title must not exceed 200 characters')
      }
    }

    // Validate order if provided
    if (input.order !== undefined) {
      if (!Number.isInteger(input.order) || input.order < 1) {
        throw new Error('Section order must be a positive integer')
      }

      // Check for duplicate order (if order is changing)
      if (input.order !== existingSection.order) {
        const duplicateSection = await prisma.sections.findUnique({
          where: {
            courseId_order: {
              courseId: existingSection.courseId,
              order: input.order,
            },
          },
        })

        if (duplicateSection) {
          throw new Error(
            `Section with order ${input.order} already exists in this course`
          )
        }
      }
    }

    // Update section
    const updatedSection = await prisma.sections.update({
      where: { id: sectionId },
      data: {
        title: input.title?.trim(),
        description:
          input.description !== undefined
            ? input.description?.trim() || null
            : undefined,
        order: input.order,
        updatedAt: new Date(),
      },
    })

    return updatedSection
  }

  /**
   * Delete a section and all its lessons (cascade)
   * Requirements: 1.4, 12.6
   * Authorization: Uses Course Service (Requirements: 0.5, 0.8)
   */
  async deleteSection(
    sectionId: string,
    userId?: string
  ): Promise<DeleteSectionResult> {
    // Check if section exists
    const existingSection = await prisma.sections.findUnique({
      where: { id: sectionId },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    })

    if (!existingSection) {
      throw new Error('Section not found')
    }

    // Check course ownership using Course Service
    if (userId) {
      const hasOwnership = await checkCourseOwnership(
        existingSection.courseId,
        userId
      )
      if (!hasOwnership) {
        throw new Error('Unauthorized: You do not own this course')
      }
    }

    const lessonCount = existingSection._count.lessons

    // Delete section (cascade will delete lessons)
    await prisma.sections.delete({
      where: { id: sectionId },
    })

    return {
      message: 'Section deleted successfully',
      deletedLessons: lessonCount,
    }
  }

  /**
   * Check if a section belongs to a specific course
   * Helper method for authorization
   */
  async verifySectionBelongsToCourse(
    sectionId: string,
    courseId: string
  ): Promise<boolean> {
    const section = await prisma.sections.findUnique({
      where: { id: sectionId },
      select: { courseId: true },
    })

    return section?.courseId === courseId
  }
}

// Export singleton instance
export const sectionService = new SectionService()

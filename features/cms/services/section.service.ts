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

    // Validate order
    if (!Number.isInteger(input.order) || input.order < 1) {
      throw new Error('Section order must be a positive integer')
    }

    // Check course ownership using Course Service
    if (userId) {
      const hasOwnership = await checkCourseOwnership(courseId, userId)
      if (!hasOwnership) {
        throw new Error('Unauthorized: You do not own this course')
      }
    }

    // Verify course exists (Course Service would be used in API layer)
    const course = await prisma.courses.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      throw new Error('Course not found')
    }

    if (!course) {
      throw new Error('Course not found')
    }

    // Check for duplicate order
    const existingSection = await prisma.sections.findUnique({
      where: {
        courseId_order: {
          courseId,
          order: input.order,
        },
      },
    })

    if (existingSection) {
      throw new Error(
        `Section with order ${input.order} already exists in this course`
      )
    }

    // Create section
    const section = await prisma.sections.create({
      data: {
        id: crypto.randomUUID(),
        courseId,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        order: input.order,
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

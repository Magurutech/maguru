/**
 * Creator Course Service
 *
 * Handles creator-specific course operations:
 * - Create new course (Quick Start)
 * - Toggle publish/unpublish status
 *
 * Location: features/cms/services/creator-course.service.ts
 * Requirements: 5.3-5.9, 6.1-6.5, 8.3-8.6
 */

import prisma from '@/prisma/lib/client'
import { CourseStatus } from '@/prisma/generated/prisma'

const VALID_DIFFICULTIES = ['Pemula', 'Menengah', 'Mahir'] as const
const VALID_STATUSES = ['DRAFT', 'PUBLISHED'] as const

export interface CreateCourseInput {
  title: string
  description: string
  category: string
  difficulty: string
  status: string
}

export interface CreateCourseResult {
  id: string
  title: string
  description: string
  category: string
  difficulty: string | null
  status: string
  creatorId: string
  createdAt: Date
  updatedAt: Date
}

export interface TogglePublishResult {
  id: string
  title: string
  status: string
}

/**
 * Validate and create a new course for a creator.
 * Requirements: 5.3, 5.4, 5.6, 5.7, 5.8, 5.9, 8.3, 8.4
 */
export async function createCourse(
  input: CreateCourseInput,
  creatorId: string
): Promise<CreateCourseResult> {
  const { title, description, category, difficulty, status } = input

  // Required field validation
  if (!title?.trim()) throw new Error('Title is required')
  if (!description?.trim()) throw new Error('Description is required')
  if (!category?.trim()) throw new Error('Category is required')
  if (!difficulty?.trim()) throw new Error('Difficulty is required')
  if (!status?.trim()) throw new Error('Status is required')

  // Title max length
  if (title.trim().length > 100) {
    throw new Error('Title must not exceed 100 characters')
  }

  // Difficulty enum validation
  if (!VALID_DIFFICULTIES.includes(difficulty as (typeof VALID_DIFFICULTIES)[number])) {
    throw new Error('Difficulty must be one of: Pemula, Menengah, Mahir')
  }

  // Status enum validation
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error('Status must be DRAFT or PUBLISHED')
  }

  const course = await prisma.courses.create({
    data: {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      difficulty: difficulty.trim(),
      status: status as CourseStatus,
      creatorId,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      difficulty: true,
      status: true,
      creatorId: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return course
}

/**
 * Toggle course status between DRAFT and PUBLISHED.
 * Verifies the caller owns the course.
 * Requirements: 6.1, 6.2, 6.5, 8.5, 8.6
 */
export async function togglePublishStatus(
  courseId: string,
  userId: string
): Promise<TogglePublishResult> {
  const course = await prisma.courses.findUnique({
    where: { id: courseId },
    select: { id: true, title: true, status: true, creatorId: true },
  })

  if (!course) {
    throw new Error('Course not found')
  }

  if (course.creatorId !== userId) {
    throw new Error('Forbidden: You do not own this course')
  }

  const newStatus =
    course.status === CourseStatus.DRAFT ? CourseStatus.PUBLISHED : CourseStatus.DRAFT

  const updated = await prisma.courses.update({
    where: { id: courseId },
    data: { status: newStatus, updatedAt: new Date() },
    select: { id: true, title: true, status: true },
  })

  return updated
}

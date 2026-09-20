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

/**
 * Generate a URL-friendly slug from a title.
 * Converts to lowercase, replaces spaces with dashes, strips non-alphanumeric chars.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 150)
}

/**
 * Ensure slug is unique — appends a short random suffix if collision detected.
 */
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  const existing = await prisma.courses.findUnique({ where: { slug: baseSlug } })
  if (!existing) return baseSlug

  // Append 6-char random suffix
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 6)
  return `${baseSlug.slice(0, 143)}-${suffix}`
}

export interface CreateCourseInput {
  title: string
  description: string
  category: string
  difficulty: string
  status: string
}

export interface CreateCourseResult {
  id: string
  slug: string
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
      slug: await ensureUniqueSlug(generateSlug(title.trim())),
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
      slug: true,
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
 * If transitioning from DRAFT to PUBLISHED or forcePublishNewVersion is true:
 * Creates a new frozen release snapshot in course_releases and updates publishedVersion.
 * If transitioning from PUBLISHED to DRAFT:
 * Marks the course as DRAFT (unpublish).
 * Verifies the caller owns the course.
 * Requirements: 6.1, 6.2, 6.5, 8.5, 8.6
 */
export async function togglePublishStatus(
  courseIdOrSlug: string,
  userId: string,
  forcePublishNewVersion = false
): Promise<TogglePublishResult> {
  // Support lookup by either unique ID or unique slug
  let course = await prisma.courses.findUnique({
    where: { id: courseIdOrSlug },
    select: { id: true, title: true, status: true, creatorId: true, publishedVersion: true, description: true },
  })

  if (!course) {
    course = await prisma.courses.findUnique({
      where: { slug: courseIdOrSlug },
      select: { id: true, title: true, status: true, creatorId: true, publishedVersion: true, description: true },
    })
  }

  if (!course) {
    throw new Error('Course not found')
  }

  if (course.creatorId !== userId) {
    throw new Error('Forbidden: You do not own this course')
  }

  const isPublishing = course.status === CourseStatus.DRAFT || forcePublishNewVersion

  if (isPublishing) {
    // 1. Fetch entire course hierarchy: sections (ordered) + lessons (ordered with content)
    const fullCourse = await prisma.courses.findUnique({
      where: { id: course.id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!fullCourse) {
      throw new Error('Course not found')
    }

    const newVersion = (course.publishedVersion ?? 0) + 1
    const totalLessons = fullCourse.sections.reduce((acc, s) => acc + s.lessons.length, 0)

    // Build the frozen snapshot JSON
    const snapshot = {
      version: newVersion,
      courseId: fullCourse.id,
      title: fullCourse.title,
      description: fullCourse.description,
      totalLessons,
      publishedAt: new Date().toISOString(),
      sections: fullCourse.sections.map((s) => ({
        id: s.id,
        courseId: s.courseId,
        title: s.title,
        description: s.description,
        order: s.order,
        lessonCount: s.lessons.length,
        lessons: s.lessons.map((l) => ({
          id: l.id,
          sectionId: l.sectionId,
          title: l.title,
          order: l.order,
          content: l.content,
        })),
      })),
    }

    // 2. Insert new release snapshot
    await prisma.course_releases.create({
      data: {
        id: crypto.randomUUID(),
        courseId: fullCourse.id,
        version: newVersion,
        title: fullCourse.title,
        description: fullCourse.description,
        totalLessons,
        snapshot: snapshot as any,
        creatorId: userId,
        publishedAt: new Date(),
      },
    })

    // 3. Update course with PUBLISHED status and pointer to new version
    const updated = await prisma.courses.update({
      where: { id: course.id },
      data: {
        status: CourseStatus.PUBLISHED,
        publishedVersion: newVersion,
        lessons: totalLessons,
        updatedAt: new Date(),
      },
      select: { id: true, title: true, status: true, publishedVersion: true },
    })

    return updated
  } else {
    // Unpublish course -> set status to DRAFT
    const updated = await prisma.courses.update({
      where: { id: course.id },
      data: {
        status: CourseStatus.DRAFT,
        updatedAt: new Date(),
      },
      select: { id: true, title: true, status: true, publishedVersion: true },
    })

    return updated
  }
}

/**
 * Publish a new release version of an already published or draft course.
 */
export async function publishCourseVersion(
  courseIdOrSlug: string,
  userId: string
): Promise<TogglePublishResult> {
  return togglePublishStatus(courseIdOrSlug, userId, true)
}

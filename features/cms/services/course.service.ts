/**
 * Course Service
 *
 * Handles course-related operations for CMS including:
 * - Course retrieval by slug
 * - Course ownership validation
 * - Authorization checks
 *
 * Location: features/cms/services/course.service.ts
 * Requirements: 0.1-0.8
 */

import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'

/**
 * Standard service result interface
 */
export interface CourseServiceResult {
  success: boolean
  data?: CourseData | CourseWithSections
  error?: string
}

/**
 * Course with sections interface
 */
export interface CourseWithSections extends CourseData {
  sections: Array<{
    id: string
    title: string
    description: string | null
    order: number
    _count: {
      lessons: number
    }
  }>
}

/**
 * Course data interface (returned by getCourseById)
 */
export interface CourseData {
  id: string
  title: string
  creatorId: string
  status: string
}

/**
 * Get course by ID
 * Used by section and lesson services for validation
 *
 * Requirements: 0.1, 0.3, 0.6
 *
 * @param courseId - Course ID
 * @returns Course data or error
 */
export async function getCourseById(courseId: string): Promise<CourseServiceResult> {
  try {
    const course = await prisma.courses.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        creatorId: true,
        status: true,
      },
    })

    if (!course) {
      return {
        success: false,
        error: 'Course not found',
      }
    }

    return {
      success: true,
      data: course as CourseData,
    }
  } catch (error) {
    console.error('Error fetching course:', error)
    return {
      success: false,
      error: 'Failed to fetch course',
    }
  }
}

/**
 * Check if user owns the course or is admin
 * Used for authorization in section/lesson operations
 *
 * Requirements: 0.2, 0.4, 0.7
 *
 * @param courseId - Course ID
 * @param userId - User ID (optional, will use auth() if not provided)
 * @returns Boolean indicating ownership
 */
export async function checkCourseOwnership(courseId: string, userId?: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    let actualUserId = userId

    if (!actualUserId) {
      const { data: { user } } = await supabase.auth.getUser()
      actualUserId = user?.id
    }

    if (!actualUserId) {
      return false
    }

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (user && (user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin')) {
      return true
    }

    // Check if user owns the course
    const course = await prisma.courses.findFirst({
      where: {
        id: courseId,
        creatorId: actualUserId,
      },
    })

    return !!course
  } catch (error) {
    console.error('Error checking course ownership:', error)
    return false
  }
}

/**
 * Get course with sections (for creator dashboard)
 *
 * Requirements: 0.1, 0.2, 0.4
 *
 * @param courseId - Course ID
 * @param userId - User ID for authorization
 * @returns Course with sections or error
 */
export async function getCourseWithSections(
  courseId: string,
  userId: string,
): Promise<CourseServiceResult> {
  try {
    const course = await prisma.courses.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            _count: {
              select: { lessons: true },
            },
          },
        },
      },
    })

    if (!course) {
      return {
        success: false,
        error: 'Course not found',
      }
    }

    // Check ownership
    const hasOwnership = await checkCourseOwnership(course.id, userId)
    if (!hasOwnership) {
      return {
        success: false,
        error: 'Unauthorized: You do not own this course',
      }
    }

    return {
      success: true,
      data: course as unknown as CourseWithSections,
    }
  } catch (error) {
    console.error('Error fetching course with sections:', error)
    return {
      success: false,
      error: 'Failed to fetch course',
    }
  }
}

/**
 * Validation result interface for outcomes
 */
interface ValidationResult {
  valid: boolean
  error?: string
  code?: string
}

/**
 * Validates an array of learning outcomes
 *
 * Rules:
 * - Max 8 items
 * - Each item: 15-255 characters (after trim)
 * - XSS sanitization
 *
 * Consolidated from courseOutcomeService.ts
 */
export function validateOutcomes(outcomes: unknown): ValidationResult {
  // Check if outcomes is an array
  if (!Array.isArray(outcomes)) {
    return {
      valid: false,
      error: 'Outcomes must be an array',
      code: 'VALIDATION_ERROR',
    }
  }

  // Check max length
  if (outcomes.length > 8) {
    return {
      valid: false,
      error: 'Maximum 8 outcomes allowed',
      code: 'VALIDATION_ERROR',
    }
  }

  // Validate each outcome
  for (let i = 0; i < outcomes.length; i++) {
    const outcome = outcomes[i]

    // Check if string
    if (typeof outcome !== 'string') {
      return {
        valid: false,
        error: `Outcome ${i + 1} must be a string`,
        code: 'VALIDATION_ERROR',
      }
    }

    // Check length after trim
    const trimmed = outcome.trim()
    if (trimmed.length < 15 || trimmed.length > 255) {
      return {
        valid: false,
        error: `Each outcome must be 15-255 characters (outcome ${i + 1} is ${trimmed.length})`,
        code: 'VALIDATION_ERROR',
      }
    }
  }

  return { valid: true }
}

/**
 * Sanitizes outcomes array by:
 * - Trimming whitespace
 * - Removing XSS patterns
 *
 * Consolidated from courseOutcomeService.ts
 */
export function sanitizeOutcomes(outcomes: string[]): string[] {
  return outcomes.map((outcome) => {
    let sanitized = outcome.trim()

    // Remove common XSS patterns
    sanitized = sanitized
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '') // onclick=, onload=, etc
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')

    return sanitized
  })
}

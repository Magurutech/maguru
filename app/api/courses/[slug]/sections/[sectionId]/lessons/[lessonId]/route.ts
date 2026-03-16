/**
 * Individual Lesson API Routes
 * GET /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId] - Get lesson
 * PUT /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId] - Update lesson
 * DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId] - Delete lesson
 * 
 * Requirements: 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 3.2, 3.4, 8.3, 9.2, 9.3, 12.7
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { lessonService } from '@/features/cms/services/lesson.service'
import { checkCourseOwnership } from '@/features/cms/services/authorization.helper'
import { UpdateLessonInput } from '@/features/cms/types/lesson.types'

/**
 * GET /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
 * Get full lesson details including complete content
 * Requirements: 2.3, 3.4, 8.3
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; sectionId: string; lessonId: string }> }
) {
  try {
    const { lessonId } = await params

    // Get lesson with full content
    const lesson = await lessonService.getLessonById(lessonId)

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error fetching lesson:', error)

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
 * Update an existing lesson
 * Requirements: 2.4, 2.6, 2.7, 2.8, 3.2, 9.2, 9.3
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; sectionId: string; lessonId: string }> }
) {
  try {
    // Authentication check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const { lessonId } = await params

    // Get lesson to verify it exists and get courseId
    const existingLesson = await lessonService.getLessonById(lessonId)
    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Authorization check - verify user owns the course or is admin
    const hasOwnership = await checkCourseOwnership(
      userId,
      existingLesson.section.courseId
    )
    if (!hasOwnership) {
      return NextResponse.json(
        {
          error: 'Forbidden: You do not have permission to modify this course',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const input: UpdateLessonInput = {
      title: body.title,
      content: body.content,
      order: body.order,
    }

    // Update lesson
    const updatedLesson = await lessonService.updateLesson(lessonId, input)

    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error('Error updating lesson:', error)

    if (error instanceof Error) {
      // Validation errors
      if (
        error.message.includes('cannot be empty') ||
        error.message.includes('must not exceed') ||
        error.message.includes('must be a positive') ||
        error.message.includes('already exists') ||
        error.message.includes('Invalid lesson content')
      ) {
        return NextResponse.json(
          {
            error: error.message,
            code: 'VALIDATION_ERROR',
          },
          { status: 400 }
        )
      }

      // Not found errors
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message, code: 'NOT_FOUND' },
          { status: 404 }
        )
      }
    }

    // Generic server error
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
 * Delete a lesson and all its progress records (cascade)
 * Requirements: 2.5, 2.7, 2.8, 12.7
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; sectionId: string; lessonId: string }> }
) {
  try {
    // Authentication check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const { lessonId } = await params

    // Get lesson to verify it exists and get courseId
    const existingLesson = await lessonService.getLessonById(lessonId)
    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Authorization check - verify user owns the course or is admin
    const hasOwnership = await checkCourseOwnership(
      userId,
      existingLesson.section.courseId
    )
    if (!hasOwnership) {
      return NextResponse.json(
        {
          error: 'Forbidden: You do not have permission to modify this course',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      )
    }

    // Delete lesson
    const result = await lessonService.deleteLesson(lessonId)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting lesson:', error)

    if (error instanceof Error) {
      // Not found errors
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message, code: 'NOT_FOUND' },
          { status: 404 }
        )
      }
    }

    // Generic server error
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

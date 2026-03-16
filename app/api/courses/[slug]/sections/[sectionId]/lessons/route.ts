/**
 * Lesson Management API Routes
 * POST /api/courses/[slug]/sections/[sectionId]/lessons - Create lesson
 * GET /api/courses/[slug]/sections/[sectionId]/lessons - List lessons
 * 
 * Requirements: 2.1, 2.2, 2.7, 2.8, 8.3, 9.2, 9.3, 9.6, 9.9
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { lessonService } from '@/features/cms/services/lesson.service'
import { sectionService } from '@/features/cms/services/section.service'
import { checkCourseOwnership } from '@/features/cms/services/authorization.helper'
import { CreateLessonInput } from '@/features/cms/types/lesson.types'

/**
 * POST /api/courses/[slug]/sections/[sectionId]/lessons
 * Create a new lesson within a section
 * Requirements: 2.1, 2.7, 2.8, 9.2, 9.3, 9.6, 9.9
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; sectionId: string }> }
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

    const { sectionId } = await params

    // Get section to verify it exists and get courseId
    const section = await sectionService.getSectionById(sectionId)
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Authorization check - verify user owns the course or is admin
    const hasOwnership = await checkCourseOwnership(userId, section.courseId)
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
    const input: CreateLessonInput = {
      title: body.title,
      content: body.content,
      order: body.order,
    }

    // Create lesson
    const lesson = await lessonService.createLesson(sectionId, input)

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)

    if (error instanceof Error) {
      // Validation errors
      if (
        error.message.includes('required') ||
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
 * GET /api/courses/[slug]/sections/[sectionId]/lessons
 * List all lessons in a section
 * Requirements: 2.2, 8.3
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; sectionId: string }> }
) {
  try {
    const { sectionId } = await params

    // Verify section exists
    const section = await sectionService.getSectionById(sectionId)
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Get lessons with preview
    const lessons = await lessonService.getLessonsBySection(sectionId)

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Error fetching lessons:', error)

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

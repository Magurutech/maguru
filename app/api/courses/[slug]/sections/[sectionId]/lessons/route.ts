/**
 * Lesson Management API Routes
 * POST /api/courses/[slug]/sections/[sectionId]/lessons - Create lesson
 * GET /api/courses/[slug]/sections/[sectionId]/lessons - List lessons
 * 
 * Requirements: 2.1, 2.2, 2.7, 2.8, 8.3, 9.2, 9.3, 9.6, 9.9
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { lessonService } from '@/features/cms/services/lesson.service'
import { sectionService } from '@/features/cms/services/section.service'
import { authorizationService } from '@/features/cms/services/authorization.service'
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }
    const userId = user.id

    const { sectionId } = await params

    // Fetch section once — reuse courseId for both auth check and createLesson
    const section = await sectionService.getSectionById(sectionId)
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    const hasOwnership = await authorizationService.checkCourseOwnershipByUserId(userId, section.courseId)
    if (!hasOwnership) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to modify this course', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const input: CreateLessonInput = {
      title: body.title,
      content: body.content,
      order: body.order,
    }

    // Pass courseId to avoid duplicate section lookup inside createLesson
    const lesson = await lessonService.createLesson(sectionId, input, undefined, section.courseId)

    // Extract contentPreview for immediate UI update (avoid re-fetch)
    const lessonContent = lesson.content as unknown as import('@/features/cms/types/lesson.types').LessonContent | null
    const contentPreview = lessonContent ? lessonService.extractContentPreview(lessonContent) : ''

    return NextResponse.json({ ...lesson, contentPreview }, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)

    if (error instanceof Error) {
      if (
        error.message.includes('required') ||
        error.message.includes('must not exceed') ||
        error.message.includes('must be a positive') ||
        error.message.includes('already exists') ||
        error.message.includes('Invalid lesson content')
      ) {
        return NextResponse.json({ error: error.message, code: 'VALIDATION_ERROR' }, { status: 400 })
      }
      if (error.message.includes('not found')) {
        return NextResponse.json({ error: error.message, code: 'NOT_FOUND' }, { status: 404 })
      }
    }

    return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, { status: 500 })
  }
}

/**
 * GET /api/courses/[slug]/sections/[sectionId]/lessons
 * List all lessons in a section
 * Requirements: 2.2, 8.3
 *
 * Optimized: single JOIN query — validates section existence and fetches lessons
 * in one round-trip. Selects only needed fields (excludes heavy `content` JSON).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; sectionId: string }> }
) {
  try {
    const { sectionId } = await params

    const lessons = await lessonService.getLessonsBySectionWithValidation(sectionId)

    if (lessons === null) {
      return NextResponse.json(
        { error: 'Section not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

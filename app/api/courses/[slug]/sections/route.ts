/**
 * Section Management API Routes
 * POST /api/courses/[slug]/sections - Create section
 * GET /api/courses/[slug]/sections - List sections
 * 
 * Requirements: 1.1, 1.2, 1.6, 1.7, 8.1, 8.2, 8.3, 9.1, 9.5, 9.8
 */

import { NextResponse } from 'next/server'
import { sectionService } from '@/features/cms/services/section.service'
import { authorizationService } from '@/features/cms/services/authorization.service'

/**
 * POST /api/courses/[slug]/sections
 * Create a new section within a course
 * Requirements: 1.1, 1.6, 1.7, 8.1, 8.2, 9.1, 9.5, 9.8
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Resolve courseId via service — no direct Prisma in route
    const courseId = await sectionService.getCourseIdBySlug(slug)
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Check authentication and authorization
    try {
      await authorizationService.requireAuthentication()
      await authorizationService.requireCourseOwnership(courseId)
    } catch (authError) {
      const message = (authError as Error).message
      if (message.includes('Unauthorized')) {
        return NextResponse.json(
          { 
            error: message,
            code: 'UNAUTHORIZED'
          },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { 
          error: message,
          code: 'FORBIDDEN'
        },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { title, description } = body

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: {
            field: 'title',
            message: 'Title is required',
          },
        },
        { status: 400 }
      )
    }

    // Create section using service (order is auto-calculated)
    const section = await sectionService.createSection(courseId, {
      title,
      description,
    })

    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    console.error('Error creating section:', error)

    const message = (error as Error).message

    // Handle validation errors
    if (
      message.includes('required') ||
      message.includes('must not exceed') ||
      message.includes('must be a positive integer') ||
      message.includes('already exists')
    ) {
      return NextResponse.json(
        {
          error: message,
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Handle duplicate order error
    if (message.includes('already exists')) {
      return NextResponse.json(
        {
          error: message,
          code: 'CONFLICT',
        },
        { status: 409 }
      )
    }

    // Generic server error
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/courses/[slug]/sections
 * List all sections in a course, ordered by order field
 * Query params:
 *   - include=lessons: Include all lessons for each section (for student learn page)
 * Requirements: 1.2, 8.3
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const includeLessons = searchParams.get('include') === 'lessons'

    // Fetch sections with or without lessons based on query param
    const result = includeLessons
      ? await sectionService.getSectionsWithLessons(slug)
      : await sectionService.getSectionsByCourseSlug(slug)

    if (!result) {
      return NextResponse.json(
        { error: 'Course not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Draft courses require auth + ownership
    if (result.courseStatus === 'DRAFT') {
      try {
        await authorizationService.requireAuthentication()
        await authorizationService.requireCourseOwnership(result.courseId)
      } catch (authError) {
        const message = (authError as Error).message
        if (message.includes('Unauthorized')) {
          return NextResponse.json({ error: message, code: 'UNAUTHORIZED' }, { status: 401 })
        }
        return NextResponse.json({ error: message, code: 'FORBIDDEN' }, { status: 403 })
      }
    }

    return NextResponse.json({ sections: result.sections })
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

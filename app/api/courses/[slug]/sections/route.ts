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
import prisma from '@/prisma/lib/client'

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
    // Get slug from params
    const { slug } = await params

    // Find course by slug
    const course = await prisma.courses.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!course) {
      return NextResponse.json(
        { 
          error: 'Course not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // Check authentication and authorization
    try {
      await authorizationService.requireAuthentication()
      await authorizationService.requireCourseOwnership(course.id)
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
    const { title, description, order } = body

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

    if (order === undefined || order === null) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: {
            field: 'order',
            message: 'Order is required',
          },
        },
        { status: 400 }
      )
    }

    // Create section using service
    const section = await sectionService.createSection(course.id, {
      title,
      description,
      order,
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
 * Requirements: 1.2, 8.3
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Get slug from params
    const { slug } = await params

    // Find course by slug
    const course = await prisma.courses.findUnique({
      where: { slug },
      select: { id: true, status: true },
    })

    if (!course) {
      return NextResponse.json(
        { 
          error: 'Course not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // For published courses, allow public access
    // For draft courses, require authentication and ownership
    if (course.status === 'DRAFT') {
      try {
        await authorizationService.requireAuthentication()
        await authorizationService.requireCourseOwnership(course.id)
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
    }

    // Get sections using service
    const sections = await sectionService.getSectionsByCourse(course.id)

    return NextResponse.json({ sections })
  } catch (error) {
    console.error('Error fetching sections:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    )
  }
}

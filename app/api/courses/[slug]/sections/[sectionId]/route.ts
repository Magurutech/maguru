/**
 * Individual Section API Routes
 * PUT /api/courses/[slug]/sections/[sectionId] - Update section
 * DELETE /api/courses/[slug]/sections/[sectionId] - Delete section
 * 
 * Requirements: 1.3, 1.4, 1.5, 1.6, 1.7, 8.1, 8.2, 9.1, 12.6
 */

import { NextResponse } from 'next/server'
import { sectionService } from '@/features/cms/services/section.service'
import { authorizationService } from '@/features/cms/services/authorization.service'
import prisma from '@/prisma/lib/client'

/**
 * PUT /api/courses/[slug]/sections/[sectionId]
 * Update an existing section
 * Requirements: 1.3, 1.5, 1.6, 1.7, 9.1
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string; sectionId: string }> }
) {
  try {
    // Get params
    const { slug, sectionId } = await params

    // Find course by slug
    const course = await prisma.course.findFirst({
      where: { title: slug },
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

    // Check if section exists and belongs to this course
    const section = await sectionService.getSectionById(sectionId)

    if (!section) {
      return NextResponse.json(
        { 
          error: 'Section not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    if (section.courseId !== course.id) {
      return NextResponse.json(
        { 
          error: 'Section does not belong to this course',
          code: 'FORBIDDEN'
        },
        { status: 403 }
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

    // Update section using service
    const updatedSection = await sectionService.updateSection(sectionId, {
      title,
      description,
      order,
    })

    return NextResponse.json(updatedSection)
  } catch (error) {
    console.error('Error updating section:', error)

    const message = (error as Error).message

    // Handle validation errors
    if (
      message.includes('required') ||
      message.includes('cannot be empty') ||
      message.includes('must not exceed') ||
      message.includes('must be a positive integer')
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

    // Handle not found error
    if (message.includes('not found')) {
      return NextResponse.json(
        {
          error: message,
          code: 'NOT_FOUND',
        },
        { status: 404 }
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
 * DELETE /api/courses/[slug]/sections/[sectionId]
 * Delete a section and all its lessons (cascade)
 * Requirements: 1.4, 1.6, 1.7, 12.6
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; sectionId: string }> }
) {
  try {
    // Get params
    const { slug, sectionId } = await params

    // Find course by slug
    const course = await prisma.course.findFirst({
      where: { title: slug },
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

    // Check if section exists and belongs to this course
    const section = await sectionService.getSectionById(sectionId)

    if (!section) {
      return NextResponse.json(
        { 
          error: 'Section not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    if (section.courseId !== course.id) {
      return NextResponse.json(
        { 
          error: 'Section does not belong to this course',
          code: 'FORBIDDEN'
        },
        { status: 403 }
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

    // Delete section using service
    const result = await sectionService.deleteSection(sectionId)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting section:', error)

    const message = (error as Error).message

    // Handle not found error
    if (message.includes('not found')) {
      return NextResponse.json(
        {
          error: message,
          code: 'NOT_FOUND',
        },
        { status: 404 }
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

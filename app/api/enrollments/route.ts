/**
 * API Routes untuk Enrollment Operations
 *
 * Endpoints:
 * - POST /api/enrollments - Create enrollment
 * - GET /api/enrollments - Get user enrollments
 *
 * Authentication: Required (Clerk)
 * Authorization: Role "user" only
 * Validation: Zod schemas
 * Error Handling: Comprehensive error responses
 */

import { NextRequest, NextResponse } from 'next/server'
import { EnrollmentService } from '@/features/course/services/enrollmentService'
import { requireAuthAndRole } from '@/lib/auth-middleware'
import { CreateEnrollmentSchema } from '@/features/course/types'

const enrollmentService = new EnrollmentService()

export async function POST(request: NextRequest) {
  try {
    // Authentication dan authorization check
    const authResult = await requireAuthAndRole(['user'])
    if (authResult.error) {
      return authResult.error
    }

    const { user } = authResult

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 },
      )
    }

    // Validate request data dengan Zod
    const validationResult = CreateEnrollmentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const { courseId } = validationResult.data

    // Additional validation
    if (!courseId || courseId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Invalid course ID provided' },
        { status: 400 },
      )
    }

    // Create enrollment
    const result = await enrollmentService.createEnrollment(user.id, { courseId })

    if (!result.success) {
      // Map service errors ke appropriate HTTP status codes
      if (result.error?.includes('already enrolled')) {
        return NextResponse.json({ success: false, error: result.error }, { status: 409 })
      }

      if (result.error?.includes('not found')) {
        console.warn(`Enrollment attempt failed - Course ${courseId} not found for user ${user.id}`)
        return NextResponse.json({ success: false, error: result.error }, { status: 404 })
      }

      if (result.error?.includes('not published')) {
        console.warn(
          `Enrollment attempt failed - Course ${courseId} not published for user ${user.id}`,
        )
        return NextResponse.json({ success: false, error: result.error }, { status: 400 })
      }

      console.error(
        `Enrollment creation failed for user ${user.id}, course ${courseId}:`,
        result.error,
      )
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    console.log(`Enrollment created successfully - User ${user.id} enrolled in course ${courseId}`)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Enrollment POST error:', error)

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authentication dan authorization check
    const authResult = await requireAuthAndRole(['user'])
    if (authResult.error) {
      return authResult.error
    }

    const { user } = authResult

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100',
        },
        { status: 400 },
      )
    }

    // Get enrollments
    const result = await enrollmentService.getEnrollments(user.id, { page, limit })

    if (!result.success) {
      // Map service errors ke appropriate HTTP status codes
      if (result.error?.includes('Database query failed')) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 })
      }

      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Enrollment GET error:', error)

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

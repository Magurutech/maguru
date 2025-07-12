/**
 * API Route untuk Enrollment Status Check
 *
 * Endpoint: GET /api/courses/[id]/enrollment-status
 * Purpose: Check if user is enrolled in specific course
 *
 * Authentication: Required (Clerk)
 * Authorization: Role "user" only
 * Parameters: courseId from URL path
 * Response: Enrollment status with date
 */

import { NextRequest, NextResponse } from 'next/server'
import { EnrollmentService } from '@/features/course/services/enrollmentService'
import { requireAuthAndRole } from '@/lib/auth-middleware'

const enrollmentService = new EnrollmentService()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authentication dan authorization check
    const authResult = await requireAuthAndRole(['user'])
    if (authResult.error) {
      return authResult.error
    }

    const { user } = authResult
    const { id: courseId } = await params

    // Validate courseId
    if (!courseId || courseId.trim() === '') {
      return NextResponse.json({ success: false, error: 'Invalid course ID' }, { status: 400 })
    }

    // Check enrollment status
    const result = await enrollmentService.getEnrollmentStatus(user.id, courseId)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Enrollment status GET error:', error)

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

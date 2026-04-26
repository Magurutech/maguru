/**
 * GET /api/progress/course/[slug]
 *
 * Get course completion status for authenticated user
 *
 * Requirements: 7.1, 7.2, 7.5, 7.6, 7.7
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { progressService } from '@/features/cms/services/progress.service'
import { unauthorizedError, notFoundError, internalError } from '@/lib/api/errors'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return unauthorizedError()
    }

    const { slug } = await params
    const result = await progressService.getCourseProgress(slug, userId)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Course not found') {
      return notFoundError('Course')
    }
    return internalError(error, 'GET /api/progress/course/[slug]')
  }
}

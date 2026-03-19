/**
 * GET /api/progress/lesson/[lessonId]
 *
 * Get lesson progress status for authenticated user
 *
 * Requirements: 6.5, 6.6
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { progressService } from '@/features/cms/services/progress.service'
import { unauthorizedError, internalError } from '@/lib/api/errors'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return unauthorizedError()
    }

    const { lessonId } = await params
    const result = await progressService.getLessonProgress(lessonId, userId)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return internalError(error, 'GET /api/progress/lesson/[lessonId]')
  }
}

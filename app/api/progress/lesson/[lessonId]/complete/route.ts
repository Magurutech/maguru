/**
 * POST /api/progress/lesson/[lessonId]/complete
 *
 * Mark a lesson as complete for the authenticated user
 *
 * Requirements: 6.2, 6.3, 6.7, 6.8, 12.2
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { progressService } from '@/features/cms/services/progress.service'
import { unauthorizedError, notFoundError, internalError } from '@/lib/api/errors'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return unauthorizedError()
    }
    const userId = user.id

    const { lessonId } = await params
    const result = await progressService.markLessonComplete(lessonId, userId)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Lesson not found') {
      return notFoundError('Lesson')
    }
    return internalError(error, 'POST /api/progress/lesson/[lessonId]/complete')
  }
}

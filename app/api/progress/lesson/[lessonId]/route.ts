/**
 * GET /api/progress/lesson/[lessonId]
 *
 * Get lesson progress status for authenticated user
 *
 * Requirements: 6.5, 6.6
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { progressService } from '@/features/cms/services/progress.service'
import { unauthorizedError, internalError } from '@/lib/api/errors'

export async function GET(
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
    const result = await progressService.getLessonProgress(lessonId, userId)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return internalError(error, 'GET /api/progress/lesson/[lessonId]')
  }
}

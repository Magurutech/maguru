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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    // Verify user authentication
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      )
    }

    const { lessonId } = await params

    // Get lesson progress using service layer
    const result = await progressService.getLessonProgress(lessonId, userId)

    // Return completion status
    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('Error fetching lesson progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson progress' },
      { status: 500 }
    )
  }
}

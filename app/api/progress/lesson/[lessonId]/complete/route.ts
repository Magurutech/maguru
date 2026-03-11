/**
 * POST /api/progress/lesson/[lessonId]/complete
 * 
 * Mark a lesson as complete for the authenticated user
 * 
 * Requirements: 6.2, 6.3, 6.7, 6.8, 12.2
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { progressService } from '@/features/cms/services/progress.service'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    // Verify user authentication (Requirement 6.8)
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      )
    }

    const { lessonId } = await params

    // Mark lesson as complete using service layer
    const result = await progressService.markLessonComplete(lessonId, userId)

    // Return success response (Requirement 12.2)
    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('Error marking lesson as complete:', error)
    
    // Handle specific error cases
    if (error instanceof Error && error.message === 'Lesson not found') {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to mark lesson as complete' },
      { status: 500 }
    )
  }
}

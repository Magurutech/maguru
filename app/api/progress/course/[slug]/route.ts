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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params

    // Get course progress using service layer
    const result = await progressService.getCourseProgress(slug, userId)

    // Return CourseCompletion data
    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('Error fetching course progress:', error)
    
    // Handle specific error cases
    if (error instanceof Error && error.message === 'Course not found') {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch course progress' },
      { status: 500 }
    )
  }
}

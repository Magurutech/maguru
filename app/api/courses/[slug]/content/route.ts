import { NextResponse } from 'next/server'
import { getCourseContent } from '@/features/course/lib/courseUtils'

export async function POST(request: Request) {
  try {
    const { contentPath } = await request.json()

    if (!contentPath) {
      return NextResponse.json(
        { error: 'Content path is required' },
        { status: 400 }
      )
    }

    const content = await getCourseContent(contentPath)

    return NextResponse.json({
      content
    })
  } catch (error) {
    console.error('Error loading course content:', error)
    return NextResponse.json(
      {
        error: 'Failed to load content',
        content: '# Content Not Found\n\nThe requested content could not be loaded.'
      },
      { status: 200 } // Return 200 with fallback content
    )
  }
}
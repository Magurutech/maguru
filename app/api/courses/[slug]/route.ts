import { NextResponse } from 'next/server'
import { loadCourse } from '@/features/course/lib/courseUtils'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const course = await loadCourse(slug)

    return NextResponse.json({
      course
    })
  } catch (error) {
    console.error(`Error fetching course:`, error)
    return NextResponse.json(
      { error: 'Course not found' },
      { status: 404 }
    )
  }
}
import { NextResponse } from 'next/server'
import { scanCourseDirectory } from '@/features/course/lib/courseUtils'

export async function GET() {
  try {
    const courses = await scanCourseDirectory()

    const courseListItems = courses.map(course => ({
      slug: course.slug,
      title: course.metadata.title,
      description: course.metadata.description,
      instructor: course.metadata.instructor,
      level: course.metadata.level,
      duration: course.metadata.duration,
      tags: course.metadata.tags,
      thumbnail: course.metadata.thumbnail
    }))

    return NextResponse.json({
      courses: courseListItems,
      total: courseListItems.length
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
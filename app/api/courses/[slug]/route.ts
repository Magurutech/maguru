import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/prisma/lib/client'

/**
 * GET /api/courses/[slug]
 *
 * Get course detail by ID (slug = course ID for now).
 * - PUBLISHED courses: accessible by anyone (anonymous, student, creator)
 * - DRAFT courses: only accessible by the course owner
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const course = await prisma.courses.findFirst({
      where: { id: slug },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        difficulty: true,
        creatorId: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // DRAFT courses are only visible to the owner
    if (course.status === 'DRAFT') {
      const user = await currentUser()
      if (!user || course.creatorId !== user.id) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json({
      ...course,
      slug: course.id
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

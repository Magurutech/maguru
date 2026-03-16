import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/prisma/lib/client'

/**
 * GET /api/courses/[slug]
 * 
 * Get course information by slug (using title as slug for now).
 * Used by creator dashboard to fetch course details.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await currentUser()
    const { slug } = await params

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // For now, use slug as course ID since schema doesn't have slug field
    const course = await prisma.courses.findFirst({
      where: { id: slug },
      select: {
        id: true,
        title: true,
        description: true,
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

    // Check authorization — only course owner can access
    const isOwner = course.creatorId === user.id

    if (!isOwner) {
      return NextResponse.json(
        { error: 'Forbidden: You do not own this course' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      ...course,
      slug: course.id // Use ID as slug for now
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

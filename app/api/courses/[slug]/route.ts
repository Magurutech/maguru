import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/prisma/lib/client'

/**
 * PATCH /api/courses/[slug]
 * Update course title and/or description.
 * Only the course owner can update.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const course = await prisma.courses.findUnique({
      where: { slug },
      select: { id: true, creatorId: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.creatorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description } = body

    const updated = await prisma.courses.update({
      where: { slug },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        updatedAt: new Date(),
      },
      select: {
        id: true, title: true, description: true,
        category: true, difficulty: true, status: true, slug: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

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

    const course = await prisma.courses.findUnique({
      where: { slug },
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
      slug: slug
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

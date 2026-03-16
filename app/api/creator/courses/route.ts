import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/prisma/lib/client'
import { createCourse } from '@/features/cms/services/creator-course.service'

/**
 * GET /api/creator/courses
 *
 * Get all courses owned by the authenticated creator.
 */
export async function GET() {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch courses owned by this creator
    const courses = await prisma.courses.findMany({
      where: {
        creatorId: user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            sections: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({
      courses: courses.map((course) => ({
        ...course,
        slug: course.id, // Use ID as slug for now
        sectionCount: course._count.sections
      }))
    })
  } catch (error) {
    console.error('Error fetching creator courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/creator/courses
 *
 * Create a new course (Quick Start) for the authenticated creator.
 *
 * Body: { title, description, category, difficulty, status }
 *
 * Returns:
 *   201 - created course
 *   400 - validation error
 *   401 - not authenticated
 */
export async function POST(request: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const course = await createCourse(body, user.id)

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      // Validation errors from service
      const validationMessages = [
        'is required',
        'must not exceed',
        'must be one of',
        'must be DRAFT or PUBLISHED',
      ]
      if (validationMessages.some((msg) => error.message.includes(msg))) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Gagal membuat kursus' },
      { status: 500 }
    )
  }
}

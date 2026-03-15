import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

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
    const courses = await prisma.course.findMany({
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
      courses: courses.map(course => ({
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

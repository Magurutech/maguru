import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/prisma/lib/client'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseIdParam = searchParams.get('courseId')
    const sectionId = searchParams.get('sectionId') || null

    // Resolve course CUID dynamically (accepts slug or CUID)
    let courseId = courseIdParam
    if (courseIdParam) {
      const course = await prisma.courses.findFirst({
        where: {
          OR: [
            { id: courseIdParam },
            { slug: courseIdParam },
          ],
        },
        select: { id: true },
      })
      if (course) {
        courseId = course.id
      }
    }

    const results = await prisma.user_assessments.findMany({
      where: {
        userId,
        ...(courseId && { courseId }),
        ...(sectionId && { sectionId }),
      },
      select: {
        id: true,
        courseId: true,
        sectionId: true,
        score: true,
        type: true,
        durationSeconds: true,
        completedAt: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error fetching assessment results:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

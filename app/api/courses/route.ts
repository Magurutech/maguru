import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'
import { CourseStatus } from '@/prisma/generated/prisma'

/**
 * GET /api/courses
 *
 * Returns paginated list of PUBLISHED courses with optional filters.
 * Auth is optional — if authenticated, includes `enrolled` status per course.
 *
 * Query params:
 *   page       - page number (default: 1)
 *   limit      - items per page (default: 12, max: 50)
 *   category   - filter by category
 *   difficulty - filter by difficulty
 *   search     - search in title or description (case-insensitive)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12')))
    const category = searchParams.get('category') ?? undefined
    const difficulty = searchParams.get('difficulty') ?? undefined
    const search = searchParams.get('search') ?? undefined

    const skip = (page - 1) * limit

    const where = {
      status: CourseStatus.PUBLISHED,
      ...(category && { category }),
      ...(difficulty && { difficulty }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [total, courses] = await Promise.all([
      prisma.courses.count({ where }),
      prisma.courses.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          category: true,
          difficulty: true,
          status: true,
          createdAt: true,
          _count: {
            select: { sections: true },
          },
          sections: {
            select: {
              _count: {
                select: { lessons: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ] as const)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    let enrolledCourseIds = new Set<string>()

    if (user) {
      const enrollments = await prisma.enrollments.findMany({
        where: { userId: user.id },
        select: { courseId: true },
      })
      enrolledCourseIds = new Set(enrollments.map((e) => e.courseId))
    }

    const result = courses.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description ? course.description.slice(0, 150) : null,
      category: course.category,
      difficulty: course.difficulty,
      status: course.status,
      sectionCount: course._count.sections,
      lessonCount: course.sections.reduce((sum: number, s: { _count: { lessons: number } }) => sum + s._count.lessons, 0),
      createdAt: course.createdAt,
      enrolled: enrolledCourseIds.has(course.id),
    }))

    return NextResponse.json({
      courses: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

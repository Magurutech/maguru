import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/prisma/lib/client'
import { CourseStatus } from '@/prisma/generated/prisma'

/**
 * POST /api/courses/[slug]/enroll
 *
 * Enroll authenticated student into a course (direct enrollment, no approval).
 *
 * Returns:
 *   201 - enrollment created
 *   401 - not authenticated
 *   403 - course is DRAFT
 *   404 - course not found
 *   409 - already enrolled
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu' },
        { status: 401 }
      )
    }

    const { slug } = await params

    const course = await prisma.courses.findUnique({
      where: { id: slug },
      select: { id: true, status: true, title: true },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Kursus tidak ditemukan' },
        { status: 404 }
      )
    }

    if (course.status === CourseStatus.DRAFT) {
      return NextResponse.json(
        { error: 'Kursus ini belum dipublikasikan' },
        { status: 403 }
      )
    }

    const existing = await prisma.enrollments.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Anda sudah terdaftar di kursus ini' },
        { status: 409 }
      )
    }

    const enrollment = await prisma.enrollments.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,
        courseId: course.id,
        enrolledAt: new Date(),
      },
      select: {
        id: true,
        userId: true,
        courseId: true,
        enrolledAt: true,
      },
    })

    return NextResponse.json({ enrollment }, { status: 201 })
  } catch (error) {
    console.error('Error enrolling in course:', error)
    return NextResponse.json(
      { error: 'Gagal mendaftar ke kursus' },
      { status: 500 }
    )
  }
}

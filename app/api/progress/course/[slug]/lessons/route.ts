/**
 * GET /api/progress/course/[slug]/lessons
 *
 * Returns list of completed lesson IDs for the authenticated user in a course.
 * Used by student learn page to show completion indicators per lesson.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedError, notFoundError, internalError } from '@/lib/api/errors'
import prisma from '@/prisma/lib/client'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedError()
    const userId = user.id

    const { slug } = await params

    const course = await prisma.courses.findUnique({
      where: { slug },
      select: { id: true },
    })
    if (!course) return notFoundError('Course')

    const progress = await prisma.lesson_progress.findMany({
      where: {
        userId,
        completed: true,
        lessons: {
          sections: { courseId: course.id },
        },
      },
      select: { lessonId: true },
    })

    return NextResponse.json({
      completedLessonIds: progress.map((p) => p.lessonId),
    })
  } catch (error) {
    return internalError(error, 'GET /api/progress/course/[slug]/lessons')
  }
}

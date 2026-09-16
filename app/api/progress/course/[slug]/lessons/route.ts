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
    
    // Auth check with 2000ms timeout guard
    let user = null
    try {
      const authPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('Auth timeout')), 2000)
      )
      const { data } = await Promise.race([authPromise, timeoutPromise])
      user = data?.user ?? null
    } catch {
      user = null
    }

    if (!user) {
      // Return safe empty progress if user is guest or auth network is slow
      return NextResponse.json({ completedLessonIds: [] })
    }
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

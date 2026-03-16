/**
 * Enrollment Service
 *
 * Handles student enrollment operations:
 * - Fetch enrolled courses with progress percentage
 *
 * Location: features/cms/services/enrollment.service.ts
 * Requirements: 3.1, 3.2, 3.6, 7.7, 7.8
 */

import prisma from '@/prisma/lib/client'

export interface EnrolledCourse {
  id: string
  enrolledAt: Date
  completed: boolean
  completedAt: Date | null
  progress: number
  course: {
    id: string
    title: string
    description: string
    category: string
    difficulty: string | null
    status: string
    thumbnail: string | null
  }
}

export interface MyCoursesResult {
  enrollments: EnrolledCourse[]
}

/**
 * Get all enrollments for a student with course data and progress percentage.
 *
 * Progress = completed lesson_progress records / total lessons in course * 100
 *
 * Requirements: 3.1, 3.2, 3.6
 */
export async function getMyEnrollments(userId: string): Promise<MyCoursesResult> {
  const enrollments = await prisma.enrollments.findMany({
    where: { userId },
    orderBy: { enrolledAt: 'desc' },
    include: {
      courses: {
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          difficulty: true,
          status: true,
          thumbnail: true,
          sections: {
            select: {
              lessons: {
                select: { id: true },
              },
            },
          },
        },
      },
    },
  })

  // Collect all lesson IDs across all enrolled courses for a single batch query
  const allLessonIds = enrollments.flatMap((e) =>
    e.courses.sections.flatMap((s) => s.lessons.map((l) => l.id))
  )

  // Batch fetch completed lesson_progress for this user
  const completedProgress = await prisma.lesson_progress.findMany({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      completed: true,
    },
    select: { lessonId: true },
  })

  const completedLessonIds = new Set(completedProgress.map((p) => p.lessonId))

  const result: EnrolledCourse[] = enrollments.map((enrollment) => {
    const lessonIds = enrollment.courses.sections.flatMap((s) =>
      s.lessons.map((l) => l.id)
    )
    const totalLessons = lessonIds.length
    const completedCount = lessonIds.filter((id) => completedLessonIds.has(id)).length
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

    return {
      id: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      completed: enrollment.completed,
      completedAt: enrollment.completedAt,
      progress,
      course: {
        id: enrollment.courses.id,
        title: enrollment.courses.title,
        description: enrollment.courses.description,
        category: enrollment.courses.category,
        difficulty: enrollment.courses.difficulty,
        status: enrollment.courses.status,
        thumbnail: enrollment.courses.thumbnail,
      },
    }
  })

  return { enrollments: result }
}

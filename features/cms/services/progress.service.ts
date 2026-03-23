/**
 * Progress Service
 * Business logic for Progress Tracking
 * Requirements: 6.1-6.8, 7.1-7.7, 12.2
 */

import prisma from '@/prisma/lib/client'
import { calculateCourseCompletion } from '@/lib/progress/calculation'
import {
  LessonProgressResponse,
  CourseProgressResponse,
  MarkLessonCompleteResult,
} from '../types/progress.types'

export class ProgressService {
  /**
   * Mark a lesson as complete for a user
   * Requirements: 6.2, 6.3, 6.7, 6.8, 12.2
   * 
   * @param lessonId - Lesson ID
   * @param userId - User ID (Clerk ID)
   * @returns Lesson progress data with completion status
   */
  async markLessonComplete(
    lessonId: string,
    userId: string
  ): Promise<MarkLessonCompleteResult> {
    // Verify lesson exists and get courseId
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        sections: {
          select: {
            courseId: true,
          },
        },
      },
    })

    if (!lesson) {
      throw new Error('Lesson not found')
    }

    const lessonProgress = await prisma.lesson_progress.upsert({
      where: {
        lessonId_userId: {
          lessonId: lessonId,
          userId: userId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        id: crypto.randomUUID(),
        lessonId: lessonId,
        userId: userId,
        completed: true,
        completedAt: new Date(),
      },
    })

    const courseId = lesson.sections.courseId
    await this.updateCourseCompletion(userId, courseId)

    // Return formatted response (Requirement 12.2)
    return {
      id: lessonProgress.id,
      lessonId: lessonProgress.lessonId,
      userId: lessonProgress.userId,
      completed: lessonProgress.completed,
      completedAt: lessonProgress.completedAt?.toISOString() || null,
      createdAt: lessonProgress.createdAt.toISOString(),
    }
  }

  /**
   * Get lesson progress status for a user
   * Requirements: 6.5, 6.6
   * 
   * @param lessonId - Lesson ID
   * @param userId - User ID (Clerk ID)
   * @returns Lesson progress status
   */
  async getLessonProgress(
    lessonId: string,
    userId: string
  ): Promise<LessonProgressResponse> {
    // Fetch LessonProgress for user and lesson (Requirement 6.5)
    const lessonProgress = await prisma.lesson_progress.findUnique({
      where: {
        lessonId_userId: {
          lessonId: lessonId,
          userId: userId,
        },
      },
    })

    // Return completion status (Requirement 6.6)
    if (lessonProgress) {
      return {
        lessonId: lessonProgress.lessonId,
        userId: lessonProgress.userId,
        completed: lessonProgress.completed,
        completedAt: lessonProgress.completedAt?.toISOString() || null,
      }
    } else {
      // Return default not completed status if no progress record exists
      return {
        lessonId: lessonId,
        userId: userId,
        completed: false,
        completedAt: null,
      }
    }
  }

  /**
   * Get course completion status for a user
   * Requirements: 7.1, 7.2, 7.5, 7.6, 7.7
   * 
   * @param courseSlug - Course slug (stored in title field)
   * @param userId - User ID (Clerk ID)
   * @returns Course completion data with percentage
   */
  async getCourseProgress(
    courseSlug: string,
    userId: string
  ): Promise<CourseProgressResponse> {
    // Find course by slug
    const course = await prisma.courses.findUnique({
      where: {
        slug: courseSlug,
      },
    })

    if (!course) {
      throw new Error('Course not found')
    }

    const totalLessons = await prisma.lessons.count({
      where: {
        sections: {
          courseId: course.id,
        },
      },
    })

    const completedLessons = await prisma.lesson_progress.count({
      where: {
        userId: userId,
        completed: true,
        lessons: {
          sections: {
            courseId: course.id,
          },
        },
      },
    })

    const { percentage, completed } = calculateCourseCompletion({
      totalLessons,
      completedLessons,
    })

    let courseCompletion = await prisma.course_completions.findUnique({
      where: {
        courseId_userId: {
          courseId: course.id,
          userId: userId,
        },
      },
    })

    if (!courseCompletion) {
      courseCompletion = await prisma.course_completions.create({
        data: {
          id: crypto.randomUUID(),
          courseId: course.id,
          userId: userId,
          percentage: percentage,
          completed: completed,
          completedAt: completed ? new Date() : null,
          updatedAt: new Date(),
        },
      })
    }

    // Return CourseCompletion data
    return {
      courseId: course.id,
      userId: userId,
      percentage: percentage,
      completedLessons: completedLessons,
      totalLessons: totalLessons,
      completed: completed,
      completedAt: courseCompletion.completedAt?.toISOString() || null,
    }
  }

  /**
   * Update CourseCompletion record when lesson is marked complete
   * Requirements: 7.3, 7.4, 7.6
   * 
   * This is called internally by markLessonComplete
   * 
   * @param userId - User ID (Clerk ID)
   * @param courseId - Course ID
   * @private
   */
  private async updateCourseCompletion(
    userId: string,
    courseId: string
  ): Promise<void> {
    const totalLessons = await prisma.lessons.count({
      where: {
        sections: {
          courseId: courseId,
        },
      },
    })

    const completedLessons = await prisma.lesson_progress.count({
      where: {
        userId: userId,
        completed: true,
        lessons: {
          sections: {
            courseId: courseId,
          },
        },
      },
    })

    const { percentage, completed } = calculateCourseCompletion({
      totalLessons,
      completedLessons,
    })

    await prisma.course_completions.upsert({
      where: {
        courseId_userId: {
          courseId: courseId,
          userId: userId,
        },
      },
      update: {
        percentage: percentage,
        completed: completed,
        completedAt: completed ? new Date() : null,
        updatedAt: new Date(),
      },
      create: {
        id: crypto.randomUUID(),
        courseId: courseId,
        userId: userId,
        percentage: percentage,
        completed: completed,
        completedAt: completed ? new Date() : null,
        updatedAt: new Date(),
      },
    })
  }
}

// Export singleton instance
export const progressService = new ProgressService()

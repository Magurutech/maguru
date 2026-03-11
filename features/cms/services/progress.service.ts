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
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          select: {
            courseId: true,
          },
        },
      },
    })

    if (!lesson) {
      throw new Error('Lesson not found')
    }

    // Create or update LessonProgress record (Requirements 6.2, 6.3)
    const lessonProgress = await prisma.lessonProgress.upsert({
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
        lessonId: lessonId,
        userId: userId,
        completed: true,
        completedAt: new Date(),
      },
    })

    // Trigger course completion recalculation (Requirement 6.7)
    const courseId = lesson.section.courseId
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
    const lessonProgress = await prisma.lessonProgress.findUnique({
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
    // Find course by slug (using title field)
    const course = await prisma.course.findFirst({
      where: {
        title: courseSlug,
      },
    })

    if (!course) {
      throw new Error('Course not found')
    }

    // Calculate total lessons in course (Requirement 7.1, 7.5)
    const totalLessons = await prisma.lesson.count({
      where: {
        section: {
          courseId: course.id,
        },
      },
    })

    // Count completed lessons for user (Requirement 7.1, 7.5)
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: userId,
        completed: true,
        lesson: {
          section: {
            courseId: course.id,
          },
        },
      },
    })

    // Calculate percentage (rounded to 2 decimals) (Requirement 7.2, 7.7)
    const { percentage, completed } = calculateCourseCompletion({
      totalLessons,
      completedLessons,
    })

    // Fetch or create CourseCompletion record (Requirement 7.6)
    let courseCompletion = await prisma.courseCompletion.findUnique({
      where: {
        courseId_userId: {
          courseId: course.id,
          userId: userId,
        },
      },
    })

    // If no record exists, create one
    if (!courseCompletion) {
      courseCompletion = await prisma.courseCompletion.create({
        data: {
          courseId: course.id,
          userId: userId,
          percentage: percentage,
          completed: completed,
          completedAt: completed ? new Date() : null,
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
    // Query total lessons in course
    const totalLessons = await prisma.lesson.count({
      where: {
        section: {
          courseId: courseId,
        },
      },
    })

    // Query completed lessons for user
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: userId,
        completed: true,
        lesson: {
          section: {
            courseId: courseId,
          },
        },
      },
    })

    // Calculate completion percentage
    const { percentage, completed } = calculateCourseCompletion({
      totalLessons,
      completedLessons,
    })

    // Upsert CourseCompletion record
    await prisma.courseCompletion.upsert({
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
        courseId: courseId,
        userId: userId,
        percentage: percentage,
        completed: completed,
        completedAt: completed ? new Date() : null,
      },
    })
  }
}

// Export singleton instance
export const progressService = new ProgressService()

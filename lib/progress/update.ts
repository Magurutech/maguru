/**
 * Progress Update Functions
 * 
 * Handles updating course completion records in the database
 * Requirements: 7.3, 7.4, 7.6
 */

import prisma from '@/prisma/lib/client'
import { calculateCourseCompletion } from './calculation'

/**
 * Update CourseCompletion record when lesson is marked complete
 * 
 * This function:
 * 1. Queries total lessons in the course
 * 2. Queries completed lessons for the user
 * 3. Calculates completion percentage
 * 4. Upserts CourseCompletion record
 * 5. Sets completedAt timestamp if 100%
 * 
 * @param userId - User ID (Clerk ID)
 * @param courseId - Course ID
 * @returns Updated CourseCompletion record
 * 
 * Requirements:
 * - 7.3: Update CourseCompletion record immediately when lesson completed
 * - 7.4: Set completed flag and completedAt timestamp if 100%
 * - 7.6: Persist course completion data across sessions
 */
export async function updateCourseCompletion(userId: string, courseId: string) {
  // Query total lessons in course
  const totalLessons = await prisma.lessons.count({
    where: {
      sections: {
        courseId: courseId
      }
    }
  })
  
  const completedLessons = await prisma.lesson_progress.count({
    where: {
      userId: userId,
      completed: true,
      lessons: {
        sections: {
          courseId: courseId
        }
      }
    }
  })
  
  const { percentage, completed } = calculateCourseCompletion({
    totalLessons,
    completedLessons
  })
  
  const courseCompletion = await prisma.course_completions.upsert({
    where: {
      courseId_userId: {
        courseId: courseId,
        userId: userId
      }
    },
    update: {
      percentage: percentage,
      completed: completed,
      completedAt: completed ? new Date() : null,
      updatedAt: new Date()
    },
    create: {
      id: crypto.randomUUID(),
      courseId: courseId,
      userId: userId,
      percentage: percentage,
      completed: completed,
      completedAt: completed ? new Date() : null,
      updatedAt: new Date()
    }
  })
  
  return courseCompletion
}

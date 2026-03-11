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
  const totalLessons = await prisma.lesson.count({
    where: {
      section: {
        courseId: courseId
      }
    }
  })
  
  // Query completed lessons for user
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId: userId,
      completed: true,
      lesson: {
        section: {
          courseId: courseId
        }
      }
    }
  })
  
  // Calculate completion percentage
  const { percentage, completed } = calculateCourseCompletion({
    totalLessons,
    completedLessons
  })
  
  // Upsert CourseCompletion record
  const courseCompletion = await prisma.courseCompletion.upsert({
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
      courseId: courseId,
      userId: userId,
      percentage: percentage,
      completed: completed,
      completedAt: completed ? new Date() : null
    }
  })
  
  return courseCompletion
}

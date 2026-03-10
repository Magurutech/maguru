/**
 * Authorization Helper Functions
 * Standalone helper functions for authorization checks
 * Requirements: 8.1, 8.2, 8.4, 8.7
 */

import { authorizationService } from './authorization.service'

/**
 * Check if a user owns a course or is an admin
 * Standalone function wrapper for use in API routes
 */
export async function checkCourseOwnership(
  userId: string,
  courseId: string
): Promise<boolean> {
  return authorizationService.checkCourseOwnershipByUserId(userId, courseId)
}

/**
 * Require course ownership or throw error
 * Standalone function wrapper for use in API routes
 */
export async function requireCourseOwnership(
  userId: string,
  courseId: string
): Promise<void> {
  const hasOwnership = await checkCourseOwnership(userId, courseId)

  if (!hasOwnership) {
    throw new Error(
      'Forbidden: You do not have permission to modify this course'
    )
  }
}

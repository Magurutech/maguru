/**
 * Authorization Service
 * Business logic for authorization checks
 * Requirements: 8.1, 8.2, 8.4, 8.7
 */

import { auth } from '@clerk/nextjs/server'
import prisma from '@/prisma/lib/client'

export class AuthorizationService {
  /**
   * Check if a specific user owns a course or is an admin
   * Requirements: 8.1, 8.2, 8.4, 8.7
   */
  async checkCourseOwnershipByUserId(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    if (!userId) {
      return false
    }

    // Check if user is admin
    // Note: Assuming user role is stored in Clerk metadata or a users table
    // For now, we'll check if the user owns the course
    // Admin check can be added when user role system is implemented

    // Check if user owns the course
    const course = await prisma.courses.findFirst({
      where: {
        id: courseId,
        creatorId: userId,
      },
    })

    return !!course
  }

  /**
   * Check if the current user owns a course or is an admin
   * Requirements: 8.1, 8.2, 8.4, 8.7
   */
  async checkCourseOwnership(courseId: string): Promise<boolean> {
    const { userId } = await auth()

    if (!userId) {
      return false
    }

    return this.checkCourseOwnershipByUserId(userId, courseId)
  }

  /**
   * Require course ownership or throw error
   * Requirements: 8.1, 8.4, 8.5, 8.7
   */
  async requireCourseOwnership(courseId: string): Promise<void> {
    const hasOwnership = await this.checkCourseOwnership(courseId)

    if (!hasOwnership) {
      throw new Error(
        'Forbidden: You do not have permission to modify this course'
      )
    }
  }

  /**
   * Get current authenticated user ID
   */
  async getCurrentUserId(): Promise<string | null> {
    const { userId } = await auth()
    return userId
  }

  /**
   * Require authentication or throw error
   */
  async requireAuthentication(): Promise<string> {
    const userId = await this.getCurrentUserId()

    if (!userId) {
      throw new Error('Unauthorized: Authentication required')
    }

    return userId
  }
}

// Export singleton instance
export const authorizationService = new AuthorizationService()

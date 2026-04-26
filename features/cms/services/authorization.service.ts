/**
 * Authorization Service
 * Business logic for authorization checks
 * Requirements: 8.1, 8.2, 8.4, 8.7
 */

import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import prisma from '@/prisma/lib/client'

export class AuthorizationService {
  /**
   * Check if a specific user owns a course OR has Admin role.
   * Requirements: 8.1, 8.2, 8.4, 8.7
   */
  async checkCourseOwnershipByUserId(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    if (!userId) return false

    // Check admin role via Clerk metadata
    try {
      const client = await clerkClient()
      const user = await client.users.getUser(userId)
      if (user?.publicMetadata?.role === 'ADMIN') return true
    } catch {
      // If Clerk call fails, fall through to ownership check
    }

    // Check if user owns the course
    const course = await prisma.courses.findFirst({
      where: { id: courseId, creatorId: userId },
      select: { id: true },
    })

    return !!course
  }

  /**
   * Check if the current authenticated user owns a course or is admin.
   * Requirements: 8.1, 8.2, 8.4, 8.7
   */
  async checkCourseOwnership(courseId: string): Promise<boolean> {
    const { userId } = await auth()
    if (!userId) return false
    return this.checkCourseOwnershipByUserId(userId, courseId)
  }

  /**
   * Require course ownership or throw error.
   * Requirements: 8.1, 8.4, 8.5, 8.7
   */
  async requireCourseOwnership(courseId: string): Promise<void> {
    const hasOwnership = await this.checkCourseOwnership(courseId)
    if (!hasOwnership) {
      throw new Error('Forbidden: You do not have permission to modify this course')
    }
  }

  /**
   * Get current authenticated user ID.
   */
  async getCurrentUserId(): Promise<string | null> {
    const { userId } = await auth()
    return userId
  }

  /**
   * Require authentication or throw error.
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

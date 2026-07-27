/**
 * Authorization Service
 * Business logic for authorization checks with Supabase Auth
 * Requirements: 8.1, 8.2, 8.4, 8.7
 */

import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'

export class AuthorizationService {
  /**
   * Require user to be authenticated, otherwise throws Error('Unauthorized')
   */
  async requireAuthentication(): Promise<{ id: string }> {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      throw new Error('Unauthorized')
    }
    return { id: user.id }
  }

  /**
   * Require user to own the course or be admin, otherwise throws Error('Forbidden')
   */
  async requireCourseOwnership(courseId: string): Promise<boolean> {
    const { id: userId } = await this.requireAuthentication()
    const isOwner = await this.checkCourseOwnershipByUserId(userId, courseId)
    if (!isOwner) {
      throw new Error('Forbidden: You do not own this course')
    }
    return true
  }

  /**
   * Check if a specific user owns a course OR has Admin role.
   * Requirements: 8.1, 8.2, 8.4, 8.7
   */
  async checkCourseOwnershipByUserId(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    if (!userId) return false

    // Check admin role via Supabase
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user && (user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin')) {
        return true
      }
    } catch {
      // If Supabase call fails, fall through to ownership check
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false
    return this.checkCourseOwnershipByUserId(user.id, courseId)
  }
}

export const authorizationService = new AuthorizationService()

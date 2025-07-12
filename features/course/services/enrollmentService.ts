/**
 * EnrollmentService - Business Logic Layer untuk Enrollment Operations
 *
 * Service ini menangani semua business logic terkait enrollment:
 * - Create enrollment dengan atomic transaction
 * - Get enrollment list dengan pagination
 * - Check enrollment status
 * - Delete enrollment (jika diperlukan)
 *
 * Designing for Failure Patterns:
 * - Atomic transactions untuk data consistency
 * - Comprehensive error handling
 * - Database connection resilience
 * - Concurrent access handling
 */

import { prisma } from '@/lib/prisma'
import { CourseStatus } from '@prisma/client'
import {
  CreateEnrollmentRequest,
  EnrollmentResponse,
  EnrollmentListResponse,
  EnrollmentStatusResponse,
  PaginationInfo,
} from '../types'

export class EnrollmentService {
  /**
   * Create enrollment untuk user ke course
   * Menggunakan atomic transaction untuk data consistency
   */
  async createEnrollment(
    userId: string,
    request: CreateEnrollmentRequest,
  ): Promise<EnrollmentResponse> {
    try {
      // Validasi input
      if (!request.courseId || request.courseId.trim() === '') {
        return {
          success: false,
          error: 'Invalid course ID provided',
        }
      }

      // Validasi course exists dan status PUBLISHED
      const course = await prisma.course.findUnique({
        where: { id: request.courseId },
      })

      if (!course) {
        return {
          success: false,
          error: 'Course not found',
        }
      }

      if (course.status !== CourseStatus.PUBLISHED) {
        return {
          success: false,
          error: 'Course is not published',
        }
      }

      // Check if user is already enrolled (prevent duplicate enrollment)
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: request.courseId,
          },
        },
      })

      if (existingEnrollment) {
        return {
          success: false,
          error: 'User is already enrolled in this course',
        }
      }

      // Atomic transaction untuk enrollment + update course.students
      const result = await prisma.$transaction(async (tx) => {
        // Create enrollment
        const enrollment = await tx.enrollment.create({
          data: {
            userId,
            courseId: request.courseId,
          },
          include: {
            course: true,
          },
        })

        // Update course students count
        await tx.course.update({
          where: { id: request.courseId },
          data: {
            students: {
              increment: 1,
            },
          },
        })

        return enrollment
      })

      return {
        success: true,
        data: result,
      }
    } catch (error) {
      // Handle specific database errors (only log unexpected errors)
      if (error instanceof Error) {
        // Unique constraint violations (duplicate enrollment) - expected in race conditions
        if (
          error.message.includes('Unique constraint failed') ||
          error.message.includes('Unique constraint violation') ||
          error.message.includes('P2002') ||
          error.message.includes('duplicate key value violates unique constraint')
        ) {
          // Don't log this as error since it's expected behavior
          return {
            success: false,
            error: 'User is already enrolled in this course',
          }
        }

        // Foreign key constraint violations
        if (
          error.message.includes('Foreign key constraint failed') ||
          error.message.includes('P2003') ||
          error.message.includes('foreign key constraint')
        ) {
          console.warn('Foreign key constraint violation during enrollment:', error.message)
          return {
            success: false,
            error: 'Course not found',
          }
        }

        // Transaction errors
        if (
          error.message.includes('Transaction failed') ||
          error.message.includes('Transaction rollback') ||
          error.message.includes('Transaction timeout') ||
          error.message.includes('Partial enrollment failure') ||
          error.message.includes('transaction')
        ) {
          console.error('Transaction error during enrollment:', error.message)
          return {
            success: false,
            error: 'Transaction failed, please try again',
          }
        }

        // Concurrent modification errors
        if (
          error.message.includes('Concurrent modification') ||
          error.message.includes('Concurrent transaction conflict') ||
          error.message.includes('Concurrent enrollment detected') ||
          error.message.includes('Race condition in student count') ||
          error.message.includes('concurrent')
        ) {
          console.warn('Concurrent modification detected during enrollment:', error.message)
          return {
            success: false,
            error: 'Concurrent modification detected, please try again',
          }
        }

        // Database connection errors
        if (
          error.message.includes('Connection failed') ||
          error.message.includes('Connection lost') ||
          error.message.includes('Connection timeout') ||
          error.message.includes('Database connection failed') ||
          error.message.includes('connection')
        ) {
          console.error('Database connection error during enrollment:', error.message)
          return {
            success: false,
            error: 'Database operation failed',
          }
        }

        // Prisma specific errors
        if (error.message.includes('Prisma') || error.message.includes('prisma')) {
          console.error('Prisma error during enrollment:', error.message)
          return {
            success: false,
            error: 'Database operation failed',
          }
        }

        // Log unexpected errors
        console.error('Unexpected enrollment creation error:', error)
      }

      return {
        success: false,
        error: 'Database operation failed',
      }
    }
  }

  /**
   * Get enrollment list untuk user dengan pagination
   */
  async getEnrollments(
    userId: string,
    pagination: { page: number; limit: number } = { page: 1, limit: 10 },
  ): Promise<EnrollmentListResponse> {
    try {
      // Normalize pagination parameters
      const page = Math.max(1, pagination.page)
      const limit = Math.max(1, Math.min(100, pagination.limit)) // Max 100 items
      const skip = (page - 1) * limit

      // Get enrollments dengan course data
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: true,
        },
        skip,
        take: limit,
        orderBy: {
          enrolledAt: 'desc',
        },
      })

      // Get total count untuk pagination
      const total = await prisma.enrollment.count({
        where: { userId },
      })

      const paginationInfo: PaginationInfo = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }

      return {
        success: true,
        data: enrollments,
        pagination: paginationInfo,
      }
    } catch (error) {
      // Handle specific database errors
      if (error instanceof Error) {
        if (
          error.message.includes('Prisma') ||
          error.message.includes('prisma') ||
          error.message.includes('database') ||
          error.message.includes('connection')
        ) {
          console.error('Database error during get enrollments:', error.message)
          return {
            success: false,
            data: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
            },
            error: 'Database query failed',
          }
        }
      }

      console.error('Unexpected error during get enrollments:', error)
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
        error: 'Database query failed',
      }
    }
  }

  /**
   * Check enrollment status untuk user di course tertentu
   */
  async getEnrollmentStatus(userId: string, courseId: string): Promise<EnrollmentStatusResponse> {
    try {
      // Validate input parameters
      if (!userId || userId.trim() === '') {
        return {
          success: false,
          isEnrolled: false,
          error: 'Invalid user ID',
        }
      }

      if (!courseId || courseId.trim() === '') {
        return {
          success: false,
          isEnrolled: false,
          error: 'Invalid course ID',
        }
      }

      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      })

      return {
        success: true,
        isEnrolled: !!enrollment,
        enrollmentDate: enrollment?.enrolledAt,
      }
    } catch (error) {
      // Handle specific database errors
      if (error instanceof Error) {
        if (
          error.message.includes('Prisma') ||
          error.message.includes('prisma') ||
          error.message.includes('database') ||
          error.message.includes('connection')
        ) {
          console.error('Database error during get enrollment status:', error.message)
          return {
            success: false,
            isEnrolled: false,
            error: 'Database query failed',
          }
        }
      }

      console.error('Unexpected error during get enrollment status:', error)
      return {
        success: false,
        isEnrolled: false,
        error: 'Database query failed',
      }
    }
  }

  /**
   * Delete enrollment (untuk future enhancement)
   */
  async deleteEnrollment(userId: string, enrollmentId: string): Promise<EnrollmentResponse> {
    try {
      // Check if enrollment exists dan belongs to user
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
      })

      if (!enrollment) {
        return {
          success: false,
          error: 'Enrollment not found',
        }
      }

      if (enrollment.userId !== userId) {
        return {
          success: false,
          error: 'Unauthorized to delete this enrollment',
        }
      }

      // Atomic transaction untuk delete enrollment + update course.students
      const result = await prisma.$transaction(async (tx) => {
        // Delete enrollment
        const deletedEnrollment = await tx.enrollment.delete({
          where: { id: enrollmentId },
        })

        // Update course students count
        await tx.course.update({
          where: { id: enrollment.courseId },
          data: {
            students: {
              decrement: 1,
            },
          },
        })

        return deletedEnrollment
      })

      return {
        success: true,
        data: result,
      }
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('Transaction failed') ||
          error.message.includes('transaction') ||
          error.message.includes('Prisma') ||
          error.message.includes('prisma') ||
          error.message.includes('database') ||
          error.message.includes('connection')
        ) {
          console.error('Database error during delete enrollment:', error.message)
          return {
            success: false,
            error: 'Database operation failed',
          }
        }
      }

      console.error('Unexpected error during delete enrollment:', error)
      return {
        success: false,
        error: 'Database operation failed',
      }
    }
  }
}

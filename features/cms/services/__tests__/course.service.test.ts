/**
 * Course Service Unit Tests
 * Tests for Course Service operations using Prisma mock
 * Based on: https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing
 * 
 * Requirements: 0.1-0.8
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { getCourseById, checkCourseOwnership, getCourseWithSections } from '../course.service'
import { prismaMock } from '@/prisma/lib/singleton'
import type { Course, Section } from '@/prisma/generated/prisma/client'

// Mock Clerk server functions (already mocked in jest.setup.js)
// Tests will use the global mocks

describe('CourseService', () => {
  const mockCourseId = 'test-course-id'
  const mockUserId = 'test-user-id'
  const mockAdminId = 'admin-user-id'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCourseById', () => {
    it('should return course data with valid id', async () => {
      // Requirement: 0.1, 0.3, 0.6
      const mockCourse: Pick<Course, 'id' | 'title' | 'creatorId' | 'status'> = {
        id: mockCourseId,
        title: 'Web Development 101',
        creatorId: mockUserId,
        status: 'DRAFT',
      }

      prismaMock.courses.findUnique.mockResolvedValue(mockCourse as Course)

      const result = await getCourseById(mockCourseId)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockCourse)
      expect(result.error).toBeUndefined()
      expect(prismaMock.courses.findUnique).toHaveBeenCalledWith({
        where: { id: mockCourseId },
        select: {
          id: true,
          title: true,
          creatorId: true,
          status: true,
        },
      })
    })

    it('should return error with invalid id', async () => {
      // Requirement: 0.3
      prismaMock.courses.findUnique.mockResolvedValue(null)

      const result = await getCourseById('non-existent-id')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Course not found')
      expect(result.data).toBeUndefined()
    })

    it('should handle database errors gracefully', async () => {
      // Requirement: 0.6
      prismaMock.courses.findUnique.mockRejectedValue(new Error('Database error'))

      const result = await getCourseById(mockCourseId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to fetch course')
    })
  })

  describe('checkCourseOwnership', () => {
    it('should return true for course owner', async () => {
      // Requirement: 0.2, 0.4
      const mockCourse: Pick<Course, 'id' | 'creatorId'> = {
        id: mockCourseId,
        creatorId: mockUserId,
      }

      // Mock Clerk clerkClient to return USER role
      const { clerkClient } = require('@clerk/nextjs/server')
      clerkClient.mockResolvedValue({
        users: {
          getUser: jest.fn().mockResolvedValue({
            id: mockUserId,
            publicMetadata: { role: 'USER' },
          }),
        },
      })

      prismaMock.courses.findFirst.mockResolvedValue(mockCourse as Course)

      const result = await checkCourseOwnership(mockCourseId, mockUserId)

      expect(result).toBe(true)
      expect(prismaMock.courses.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockCourseId,
          creatorId: mockUserId,
        },
      })
    })

    it('should return true for admin user', async () => {
      // Requirement: 0.4, 0.7
      // Mock Clerk clerkClient to return ADMIN role
      const { clerkClient } = require('@clerk/nextjs/server')
      clerkClient.mockResolvedValue({
        users: {
          getUser: jest.fn().mockResolvedValue({
            id: mockAdminId,
            publicMetadata: { role: 'ADMIN' },
          }),
        },
      })

      const result = await checkCourseOwnership(mockCourseId, mockAdminId)

      expect(result).toBe(true)
      // Should not check course ownership for admin
      expect(prismaMock.courses.findFirst).not.toHaveBeenCalled()
    })

    it('should return false for non-owner', async () => {
      // Requirement: 0.2, 0.7
      const { clerkClient } = require('@clerk/nextjs/server')
      clerkClient.mockResolvedValue({
        users: {
          getUser: jest.fn().mockResolvedValue({
            id: 'other-user-id',
            publicMetadata: { role: 'USER' },
          }),
        },
      })

      prismaMock.courses.findFirst.mockResolvedValue(null)

      const result = await checkCourseOwnership(mockCourseId, 'other-user-id')

      expect(result).toBe(false)
    })

    it('should return false when user not found', async () => {
      // Requirement: 0.7
      const { clerkClient } = require('@clerk/nextjs/server')
      clerkClient.mockResolvedValue({
        users: {
          getUser: jest.fn().mockRejectedValue(new Error('User not found')),
        },
      })

      const result = await checkCourseOwnership(mockCourseId, 'non-existent-user')

      expect(result).toBe(false)
    })

    it('should return false when userId is not provided and auth fails', async () => {
      // Requirement: 0.7
      const { auth } = require('@clerk/nextjs/server')
      auth.mockResolvedValueOnce({ userId: null })

      const result = await checkCourseOwnership(mockCourseId)

      expect(result).toBe(false)
    })

    it('should handle database errors gracefully', async () => {
      // Requirement: 0.6
      const { clerkClient } = require('@clerk/nextjs/server')
      clerkClient.mockResolvedValue({
        users: {
          getUser: jest.fn().mockResolvedValue({
            id: mockUserId,
            publicMetadata: { role: 'USER' },
          }),
        },
      })

      prismaMock.courses.findFirst.mockRejectedValue(new Error('Database error'))

      const result = await checkCourseOwnership(mockCourseId, mockUserId)

      expect(result).toBe(false)
    })
  })

  describe('getCourseWithSections', () => {
    it('should return course with sections for authorized user', async () => {
      // Requirement: 0.1, 0.2, 0.4
      type SectionWithCount = Section & { _count: { lessons: number } }
      
      const mockSections: SectionWithCount[] = [
        {
          id: 'section-1',
          courseId: mockCourseId,
          title: 'Introduction',
          description: 'Getting started',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { lessons: 3 },
        },
        {
          id: 'section-2',
          courseId: mockCourseId,
          title: 'Advanced Topics',
          description: null,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { lessons: 5 },
        },
      ]

      const mockCourseWithSections = {
        id: mockCourseId,
        title: 'Web Development 101',
        creatorId: mockUserId,
        status: 'DRAFT',
        sections: mockSections,
      }

      const mockCourse: Pick<Course, 'id' | 'creatorId'> = {
        id: mockCourseId,
        creatorId: mockUserId,
      }

      // Mock Clerk
      const { clerkClient } = require('@clerk/nextjs/server')
      clerkClient.mockResolvedValue({
        users: {
          getUser: jest.fn().mockResolvedValue({
            id: mockUserId,
            publicMetadata: { role: 'USER' },
          }),
        },
      })

      prismaMock.courses.findUnique.mockResolvedValue(mockCourseWithSections as Course)
      prismaMock.courses.findFirst.mockResolvedValue(mockCourse as Course)

      const result = await getCourseWithSections(mockCourseId, mockUserId)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockCourseWithSections)
      expect(result.data?.sections).toHaveLength(2)
      expect(result.data?.sections[0]._count.lessons).toBe(3)
    })

    it('should return error when course not found', async () => {
      // Requirement: 0.1
      prismaMock.courses.findUnique.mockResolvedValue(null)

      const result = await getCourseWithSections('non-existent-id', mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Course not found')
    })

    it('should return error for unauthorized user', async () => {
      // Requirement: 0.2, 0.4
      const mockCourse = {
        id: mockCourseId,
        title: 'Web Development 101',
        creatorId: 'other-user-id',
        status: 'DRAFT',
        sections: [],
      }

      // Mock Clerk
      const { clerkClient } = require('@clerk/nextjs/server')
      clerkClient.mockResolvedValue({
        users: {
          getUser: jest.fn().mockResolvedValue({
            id: mockUserId,
            publicMetadata: { role: 'USER' },
          }),
        },
      })

      prismaMock.courses.findUnique.mockResolvedValue(mockCourse as Course)
      prismaMock.courses.findFirst.mockResolvedValue(null)

      const result = await getCourseWithSections(mockCourseId, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Unauthorized: You do not own this course')
    })

    it('should allow admin to access any course', async () => {
      // Requirement: 0.4
      const mockCourse = {
        id: mockCourseId,
        title: 'Web Development 101',
        creatorId: 'other-user-id',
        status: 'DRAFT',
        sections: [],
      }

      // Mock Clerk for admin
      const { clerkClient } = require('@clerk/nextjs/server')
      clerkClient.mockResolvedValue({
        users: {
          getUser: jest.fn().mockResolvedValue({
            id: mockAdminId,
            publicMetadata: { role: 'ADMIN' },
          }),
        },
      })

      prismaMock.courses.findUnique.mockResolvedValue(mockCourse as Course)

      const result = await getCourseWithSections(mockCourseId, mockAdminId)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockCourse)
    })

    it('should handle database errors gracefully', async () => {
      // Requirement: 0.6
      prismaMock.courses.findUnique.mockRejectedValue(new Error('Database error'))

      const result = await getCourseWithSections(mockCourseId, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to fetch course')
    })
  })
})

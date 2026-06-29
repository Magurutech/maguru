/**
 * Course Service Unit Tests
 * Tests for Course Service operations using Prisma mock
 * Based on: https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing
 *
 * Requirements: 0.1-0.8
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import {
  getCourseById,
  checkCourseOwnership,
  getCourseWithSections,
  validateOutcomes,
  sanitizeOutcomes,
} from '../course.service'
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

  describe('validateOutcomes', () => {
    it('should return error if outcomes is not an array', () => {
      const result = validateOutcomes('not an array')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Outcomes must be an array')
      expect(result.code).toBe('VALIDATION_ERROR')
    })

    it('should return error if outcomes array has more than 8 items', () => {
      const tooManyOutcomes = Array(9).fill('Valid outcome with more than fifteen characters')
      const result = validateOutcomes(tooManyOutcomes)

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Maximum 8 outcomes allowed')
      expect(result.code).toBe('VALIDATION_ERROR')
    })

    it('should return error if any outcome is not a string', () => {
      const invalidOutcomes = [
        'Valid outcome string',
        123, // Not a string
        'Another valid outcome',
      ]
      const result = validateOutcomes(invalidOutcomes)

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Outcome 2 must be a string')
      expect(result.code).toBe('VALIDATION_ERROR')
    })

    it('should return error if any outcome is less than 15 characters', () => {
      const invalidOutcomes = [
        'Valid outcome with sufficient length',
        'Too short', // Only 9 characters
        'Another valid outcome here',
      ]
      const result = validateOutcomes(invalidOutcomes)

      expect(result.valid).toBe(false)
      expect(result.error).toContain('Each outcome must be 15-255 characters')
      expect(result.code).toBe('VALIDATION_ERROR')
    })

    it('should return error if any outcome is more than 255 characters', () => {
      const tooLong = 'a'.repeat(256)
      const invalidOutcomes = [
        'Valid outcome with sufficient length',
        tooLong,
        'Another valid outcome here',
      ]
      const result = validateOutcomes(invalidOutcomes)

      expect(result.valid).toBe(false)
      expect(result.error).toContain('Each outcome must be 15-255 characters')
      expect(result.code).toBe('VALIDATION_ERROR')
    })

    it('should return valid for array with valid outcomes', () => {
      const validOutcomes = [
        'Memahami arsitektur modern web application',
        'Menguasai konsep Next.js server component',
        'Membangun modul CRUD database yang teruji',
      ]
      const result = validateOutcomes(validOutcomes)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should trim whitespace before validating length', () => {
      const outcomesWithWhitespace = [
        '   Valid outcome with trimmed spaces   ',
        'Another valid outcome',
      ]
      const result = validateOutcomes(outcomesWithWhitespace)

      expect(result.valid).toBe(true)
    })

    it('should accept empty array', () => {
      const result = validateOutcomes([])

      expect(result.valid).toBe(true)
    })
  })

  describe('sanitizeOutcomes', () => {
    it('should trim whitespace from outcomes', () => {
      const outcomes = [
        '   Outcome with leading spaces',
        'Outcome with trailing spaces   ',
        '   Outcome with both   ',
      ]
      const result = sanitizeOutcomes(outcomes)

      expect(result[0]).toBe('Outcome with leading spaces')
      expect(result[1]).toBe('Outcome with trailing spaces')
      expect(result[2]).toBe('Outcome with both')
    })

    it('should remove <script> tags', () => {
      const outcomes = [
        'Valid outcome <script>alert("XSS")</script> with script',
        'Another outcome <script src="evil.js"></script> here',
      ]
      const result = sanitizeOutcomes(outcomes)

      expect(result[0]).toBe('Valid outcome  with script')
      expect(result[1]).toBe('Another outcome  here')
      expect(result[0]).not.toContain('<script>')
      expect(result[1]).not.toContain('<script>')
    })

    it('should remove javascript: protocol', () => {
      const outcomes = [
        'Valid outcome javascript:alert("XSS") with protocol',
        'Another javascript:void(0) outcome',
      ]
      const result = sanitizeOutcomes(outcomes)

      expect(result[0]).not.toContain('javascript:')
      expect(result[1]).not.toContain('javascript:')
    })

    it('should remove event handler attributes', () => {
      const outcomes = [
        'Valid outcome onclick=alert("XSS") with event',
        'Another onload=malicious() outcome',
        'Third onerror=bad() example',
      ]
      const result = sanitizeOutcomes(outcomes)

      expect(result[0]).not.toContain('onclick=')
      expect(result[1]).not.toContain('onload=')
      expect(result[2]).not.toContain('onerror=')
    })

    it('should remove <iframe> tags', () => {
      const outcomes = [
        'Valid outcome <iframe src="evil.com"></iframe> with iframe',
        'Another <iframe> malicious </iframe> content',
      ]
      const result = sanitizeOutcomes(outcomes)

      expect(result[0]).toBe('Valid outcome  with iframe')
      expect(result[1]).toBe('Another  content')
      expect(result[0]).not.toContain('<iframe>')
      expect(result[1]).not.toContain('<iframe>')
    })

    it('should handle multiple XSS patterns in single outcome', () => {
      const outcomes = [
        '<script>alert("XSS")</script> Outcome onclick=bad() with javascript:void(0) multiple <iframe></iframe> attacks',
      ]
      const result = sanitizeOutcomes(outcomes)

      expect(result[0]).not.toContain('<script>')
      expect(result[0]).not.toContain('onclick=')
      expect(result[0]).not.toContain('javascript:')
      expect(result[0]).not.toContain('<iframe>')
    })

    it('should not modify clean outcomes', () => {
      const outcomes = [
        'Clean outcome without any XSS',
        'Another safe outcome here',
        'Third valid learning outcome',
      ]
      const result = sanitizeOutcomes(outcomes)

      expect(result[0]).toBe('Clean outcome without any XSS')
      expect(result[1]).toBe('Another safe outcome here')
      expect(result[2]).toBe('Third valid learning outcome')
    })

    it('should handle empty array', () => {
      const result = sanitizeOutcomes([])

      expect(result).toEqual([])
    })
  })
})

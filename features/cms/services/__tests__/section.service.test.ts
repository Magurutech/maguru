/**
 * Section Service Unit Tests
 * Tests for Section CRUD operations using Prisma mock
 * Based on: https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing
 * 
 * Requirements: 1.1-1.8, 9.1, 9.5, 9.8, 12.5, 12.6
 * Updated: Now tests Course Service integration (Requirements: 0.5, 0.8)
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { sectionService } from '../section.service'
import { prismaMock } from '@/prisma/lib/singleton'
import type { Course, Section } from '@/prisma/generated/prisma/client'

// Mock Course Service - must be before imports
jest.mock('../course.service')

import { checkCourseOwnership } from '../course.service'

describe('SectionService', () => {
  const mockCourseId = 'test-course-id'
  const mockSectionId = 'test-section-id'
  const mockUserId = 'test-user-id'

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    // Default: user has ownership
    ;(checkCourseOwnership as jest.Mock).mockResolvedValue(true)
  })

  describe('createSection', () => {
    it('should create a section with valid data', async () => {
      // Requirement: 1.1
      const mockCourse: Pick<Course, 'id'> = { id: mockCourseId }
      const mockSection: Section = {
        id: mockSectionId,
        courseId: mockCourseId,
        title: 'Introduction',
        description: 'Getting started',
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
 //eslint-disable-next-line 
      prismaMock.courses.findUnique.mockResolvedValue(mockCourse as any)
      prismaMock.sections.findUnique.mockResolvedValue(null)
      prismaMock.sections.create.mockResolvedValue(mockSection)

      const result = await sectionService.createSection(
        mockCourseId,
        {
          title: 'Introduction',
          description: 'Getting started',
          order: 1,
        },
        mockUserId
      )

      expect(result).toEqual(mockSection)
      expect(checkCourseOwnership).toHaveBeenCalledWith(mockCourseId, mockUserId)
      expect(prismaMock.courses.findUnique).toHaveBeenCalledWith({
        where: { id: mockCourseId },
      })
    })

    it('should reject unauthorized user', async () => {
      // Requirement: 0.5, 0.8
      ;(checkCourseOwnership as jest.Mock).mockResolvedValue(false)

      await expect(
        sectionService.createSection(
          mockCourseId,
          {
            title: 'Test Section',
            order: 1,
          },
          mockUserId
        )
      ).rejects.toThrow('Unauthorized: You do not own this course')
    })

    it('should reject empty title', async () => {
      // Requirement: 9.1
      await expect(
        sectionService.createSection(
          mockCourseId,
          {
            title: '',
            order: 1,
          },
          mockUserId
        )
      ).rejects.toThrow('Section title is required')
    })

    it('should reject title exceeding 200 characters', async () => {
      // Requirement: 9.1
      await expect(
        sectionService.createSection(
          mockCourseId,
          {
            title: 'a'.repeat(201),
            order: 1,
          },
          mockUserId
        )
      ).rejects.toThrow('Section title must not exceed 200 characters')
    })

    it('should reject non-positive order', async () => {
      // Requirement: 9.8
      await expect(
        sectionService.createSection(
          mockCourseId,
          {
            title: 'Test Section',
            order: 0,
          },
          mockUserId
        )
      ).rejects.toThrow('Section order must be a positive integer')
    })

    it('should reject if course does not exist', async () => {
      // Requirement: 9.5
      prismaMock.courses.findUnique.mockResolvedValue(null)

      await expect(
        sectionService.createSection(
          mockCourseId,
          {
            title: 'Test Section',
            order: 1,
          },
          mockUserId
        )
      ).rejects.toThrow('Course not found')
    })

    it('should reject duplicate order within same course', async () => {
      // Requirement: 9.8
      const mockCourse: Pick<Course, 'id'> = { id: mockCourseId }
      const existingSection: Pick<Section, 'id' | 'order'> = { 
        id: 'existing-id', 
        order: 1 
      }
 //eslint-disable-next-line 
      prismaMock.courses.findUnique.mockResolvedValue(mockCourse as any)
       //eslint-disable-next-line 
      prismaMock.sections.findUnique.mockResolvedValue(existingSection as any)

      await expect(
        sectionService.createSection(
          mockCourseId,
          {
            title: 'Test Section',
            order: 1,
          },
          mockUserId
        )
      ).rejects.toThrow('Section with order 1 already exists in this course')
    })
  })

  describe('getSectionsByCourse', () => {
    it('should return sections ordered by order field', async () => {
      // Requirement: 1.2
      type SectionWithCount = Section & { _count: { lessons: number } }
      
      const mockSections: SectionWithCount[] = [
        {
          id: '1',
          courseId: mockCourseId,
          title: 'Section 1',
          description: null,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { lessons: 0 },
        },
        {
          id: '2',
          courseId: mockCourseId,
          title: 'Section 2',
          description: null,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { lessons: 3 },
        },
      ]

      prismaMock.sections.findMany.mockResolvedValue(mockSections)

      const result = await sectionService.getSectionsByCourse(mockCourseId)

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Section 1')
      expect(result[0].lessonCount).toBe(0)
      expect(result[1].title).toBe('Section 2')
      expect(result[1].lessonCount).toBe(3)
    })

    it('should return empty array for course with no sections', async () => {
      prismaMock.sections.findMany.mockResolvedValue([])

      const result = await sectionService.getSectionsByCourse(mockCourseId)

      expect(result).toEqual([])
    })
  })

  describe('updateSection', () => {
    it('should update section title', async () => {
      // Requirement: 1.3
      const existingSection: Section = {
        id: mockSectionId,
        courseId: mockCourseId,
        title: 'Original Title',
        description: null,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedSection: Section = {
        ...existingSection,
        title: 'Updated Title',
      }

      prismaMock.sections.findUnique.mockResolvedValue(existingSection)
      prismaMock.sections.update.mockResolvedValue(updatedSection)

      const result = await sectionService.updateSection(
        mockSectionId,
        {
          title: 'Updated Title',
        },
        mockUserId
      )

      expect(result.title).toBe('Updated Title')
      expect(checkCourseOwnership).toHaveBeenCalledWith(mockCourseId, mockUserId)
    })

    it('should reject unauthorized user', async () => {
      // Requirement: 0.5, 0.8
      const existingSection: Pick<Section, 'id' | 'courseId'> = {
        id: mockSectionId,
        courseId: mockCourseId,
      }
 //eslint-disable-next-line 
      prismaMock.sections.findUnique.mockResolvedValue(existingSection as any)
      ;(checkCourseOwnership as jest.Mock).mockResolvedValue(false)

      await expect(
        sectionService.updateSection(
          mockSectionId,
          { title: 'Test' },
          mockUserId
        )
      ).rejects.toThrow('Unauthorized: You do not own this course')
    })

    it('should reject if section does not exist', async () => {
      prismaMock.sections.findUnique.mockResolvedValue(null)

      await expect(
        sectionService.updateSection(mockSectionId, { title: 'Test' }, mockUserId)
      ).rejects.toThrow('Section not found')
    })

    it('should reject duplicate order when updating', async () => {
      // Requirement: 9.8
      const existingSection: Pick<Section, 'id' | 'courseId' | 'order'> = {
        id: mockSectionId,
        courseId: mockCourseId,
        order: 2,
      }

      const duplicateSection: Pick<Section, 'id' | 'courseId' | 'order'> = {
        id: 'other-id',
        courseId: mockCourseId,
        order: 1,
      }

      prismaMock.sections.findUnique
       //eslint-disable-next-line 
        .mockResolvedValueOnce(existingSection as any)
         //eslint-disable-next-line 
        .mockResolvedValueOnce(duplicateSection as any)

      await expect(
        sectionService.updateSection(mockSectionId, { order: 1 }, mockUserId)
      ).rejects.toThrow('Section with order 1 already exists in this course')
    })
  })

  describe('deleteSection', () => {
    it('should delete section and return deleted lesson count', async () => {
      // Requirement: 1.4, 12.6
      type SectionWithCount = Pick<Section, 'id' | 'courseId'> & { 
        _count: { lessons: number } 
      }
      
      const existingSection: SectionWithCount = {
        id: mockSectionId,
        courseId: mockCourseId,
        _count: { lessons: 5 },
      }
//eslint-disable-next-line 
      prismaMock.sections.findUnique.mockResolvedValue(existingSection as any)
      // Mock $transaction to execute the callback with prismaMock as tx
      //eslint-disable-next-line 
      prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock))
      //eslint-disable-next-line 
      prismaMock.lessons.deleteMany.mockResolvedValue({ count: 5 } as any)
      //eslint-disable-next-line 
      prismaMock.sections.delete.mockResolvedValue(existingSection as any)

      const result = await sectionService.deleteSection(mockSectionId, mockUserId)

      expect(result.message).toBe('Section deleted successfully')
      expect(result.deletedLessons).toBe(5)
      expect(checkCourseOwnership).toHaveBeenCalledWith(mockCourseId, mockUserId)
      expect(prismaMock.lessons.deleteMany).toHaveBeenCalledWith({
        where: { sectionId: mockSectionId },
      })
      expect(prismaMock.sections.delete).toHaveBeenCalledWith({
        where: { id: mockSectionId },
      })
    })

    it('should reject unauthorized user', async () => {
      // Requirement: 0.5, 0.8
      type SectionWithCount = Pick<Section, 'id' | 'courseId'> & { 
        _count: { lessons: number } 
      }
      
      const existingSection: SectionWithCount = {
        id: mockSectionId,
        courseId: mockCourseId,
        _count: { lessons: 5 },
      }
 //eslint-disable-next-line 
      prismaMock.sections.findUnique.mockResolvedValue(existingSection as any)
      ;(checkCourseOwnership as jest.Mock).mockResolvedValue(false)

      await expect(
        sectionService.deleteSection(mockSectionId, mockUserId)
      ).rejects.toThrow('Unauthorized: You do not own this course')
    })

    it('should reject if section does not exist', async () => {
      prismaMock.sections.findUnique.mockResolvedValue(null)

      await expect(
        sectionService.deleteSection(mockSectionId, mockUserId)
      ).rejects.toThrow('Section not found')
    })
  })
})
